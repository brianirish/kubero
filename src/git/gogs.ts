import debug from 'debug';
import * as crypto from "crypto"
import { IWebhook, IRepository, IWebhookR, IDeploykeyR} from './types';
import { Repo } from './repo';
import gitUrlParse = require("git-url-parse");
debug('app:kubero:gogs:api')

//https://www.npmjs.com/package/gitea-js
import { giteaApi, Api } from "gitea-js"
import { fetch as fetchGitea } from 'cross-fetch';

export class GogsApi extends Repo {
    private gitea: any;

    constructor(baseURL: string, token: string) {
        super("gogs");
        this.gitea = giteaApi(baseURL, {
            token: token,
            customFetch: fetchGitea,
        });
    }

    protected async getRepository(gitrepo: string): Promise<IRepository> {
        const GitUrlParse = require("git-url-parse");

        let ret: IRepository = {
            status: 500,
            statusText: 'error',
            data: {
                owner: 'unknown',
                name: 'unknown',
                admin: false,
                push: false,
            }
        }

        let parsed = gitUrlParse(gitrepo)
        let repo = parsed.name
        let owner = parsed.owner
        
        if ( owner == undefined ){
            debug.log("git owner extraction failed");
            throw new Error("git owner extraction failed");
        }
        if ( repo == undefined ){
            debug.log("git owner extraction failed");
            throw new Error("git repo extraction failed");
        }

        let res = await this.gitea.repos.repoGet(owner, repo)
        .catch((error: any) => {
            console.log(error)
            return ret;
        })

        ret = {
            status: res.status,
            statusText: 'found',
            data: {
                id: res.data.id,
                node_id: res.data.node_id,
                name: res.data.name,
                description: res.data.description,
                owner: res.data.owner.login,
                private : res.data.private,
                ssh_url: res.data.ssh_url,
                language: res.data.language,
                homepage: res.data.homepage,
                admin: res.data.permissions.admin,
                push: res.data.permissions.push,
                visibility: res.data.visibility,
                default_branch: res.data.default_branch,
            }
        }
        return ret;

    }

    protected async addWebhook(owner: string, repo: string, url: string, secret: string): Promise<IWebhookR> {

        let ret: IWebhookR = {
            status: 500,
            statusText: 'error',
            data: {
                id: 0,
                active: false,
                created_at: '2020-01-01T00:00:00Z',
                url: '',
                insecure: true,
                events: [],
            }
        }

        //https://try.gitea.io/api/swagger#/repository/repoListHooks
        const webhooksList = await this.gitea.repos.repoListHooks(owner, repo)
        .catch((error: any) => {
            console.log(error)
            return ret;
        })

        // try to find the webhook
        for (let webhook of webhooksList.data) {
            if (webhook.config.url === url &&
                webhook.config.content_type === 'json' &&
                webhook.active === true) {
                ret = {
                    status: 422,
                    statusText: 'found',
                    data: webhook,
                }
                return ret;
            }
        }
        //console.log(webhooksList)

        // create the webhook since it does not exist
        try {

            //https://try.gitea.io/api/swagger#/repository/repoCreateHook
            let res = await this.gitea.repos.repoCreateHook(owner, repo, {
                active: true,
                config: {
                    url: url,
                    content_type: "json",
                    secret: secret,
                    insecure_ssl: '0'
                },
                events: [
                    "push",
                    "pull_request"
                ],
                type: "gogs"
            });

            ret = {
                status: res.status,
                statusText: 'created',
                data: {
                    id: res.data.id,
                    active: res.data.active,
                    created_at: res.data.created_at,
                    url: res.data.url,
                    insecure: res.data.config.insecure_ssl,
                    events: res.data.events,
                }
            }
        } catch (e) {
            console.log(e)
        }
        return ret;
    }


    protected async addDeployKey(owner: string, repo: string): Promise<IDeploykeyR> {

        const keyPair = this.createDeployKeyPair();

        const title: string = "bot@kubero."+crypto.randomBytes(4).toString('hex');

        let ret: IDeploykeyR = {
            status: 500,
            statusText: 'error',
            data: {
                id: 0,
                title: title,
                verified: false,
                created_at: '2020-01-01T00:00:00Z',
                url: '',
                read_only: true,
                pub: keyPair.pubKeyBase64,
                priv: keyPair.privKeyBase64
            }
        }
        try {
            //https://try.gitea.io/api/swagger#/repository/repoCreateKey
            let res = await this.gitea.repos.repoCreateKey(owner, repo, {
                title: title,
                key: keyPair.pubKey,
                read_only: true
            });

            ret = {
                status: res.status,
                statusText: 'created',
                data: {
                    id: res.data.id,
                    title: res.data.title,
                    verified: res.data.verified,
                    created_at: res.data.created_at,
                    url: res.data.url,
                    read_only: res.data.read_only,
                    pub: keyPair.pubKeyBase64,
                    priv: keyPair.privKeyBase64
                }
            }
        } catch (e) {
            console.log(e)
        }

        return ret
    }

    public getWebhook(event: string, delivery: string, signature: string, body: any): IWebhook | boolean {
        let secret = process.env.KUBERO_WEBHOOK_SECRET as string;
        let hash = crypto.createHmac('sha256', secret).update(JSON.stringify(body, null, '  ')).digest('hex')

        let verified = false;
        if (hash === signature) {
            debug.debug('Gogs webhook signature is valid for event: '+delivery);
            verified = true;
        } else {
            debug.log('ERROR: invalid signature for event: '+delivery);
            debug.log('Hash:      '+hash);
            debug.log('Signature: '+signature);
            verified = false;
            return false;
        }

        let branch: string = 'main';
        let ssh_url: string = '';
        let action;
        if (body.pull_request == undefined) {
            let ref = body.ref
            let refs = ref.split('/')
            branch = refs[refs.length - 1]
            ssh_url = body.repository.ssh_url
        } else if (body.pull_request != undefined) {
            action = body.action,
            branch = body.pull_request.head.ref
            ssh_url = body.pull_request.head.repo.ssh_url
        } else {
            ssh_url = body.repository.ssh_url
        }

        try {
            let webhook: IWebhook = {
                repoprovider: 'gogs',
                action: action,
                event: event,
                delivery: delivery,
                body: body,
                branch: branch,
                verified: verified,
                repo: {
                    ssh_url: ssh_url,
                }
            }

            return webhook;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    public async listRepos(): Promise<string[]> {
        let ret: string[] = [];
        try {
            const repos = await this.gitea.user.userCurrentListRepos()
            for (let repo of repos.data) {
                ret.push(repo.ssh_url)
            }
        } catch (error) {
            console.log(error)
        }
        return ret;
    }

    public async getBranches(gitrepo: string): Promise<string[]>{
        // https://try.gitea.io/api/swagger#/repository/repoListBranches
        let ret: string[] = [];

        let {repo, owner} = this.parseRepo(gitrepo)

        try {
            const branches = await this.gitea.repos.repoListBranches(owner, repo)
            for (let branch of branches.data) {
                ret.push(branch.name)
            }
        } catch (error) {
            console.log(error)
        }

        return ret;
    }
}
