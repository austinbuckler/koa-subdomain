const Koa = require('koa');
const app = module.exports = new Koa();

function subdomain(domain, middleware) {
    return async (ctx, next) => {
        let req = ctx.request;       
        let expected = domain
        let actual = req.subdomains.reverse().join('.')
        if (actual === expected ||
            expected.indexOf('*') !== -1) {
            return await middleware(ctx, next)
        }
        await next();
    }
}

if (!module.parent) {
    app.use(subdomain('*', async (ctx) => {
        ctx.body = 'hello world!'
    }));
    app.use(async (ctx) => ctx.body = 'default route');
    app.listen(3000, () => { console.log('listening...') });
}

module.exports = subdomain;