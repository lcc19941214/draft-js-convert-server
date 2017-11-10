const router = require('koa-router')()
const convert = require('../scripts/convert');

router.prefix('/scripts')

router.get('/convert', async (ctx, next) => {
  const content = '<b>hello</b> <i>world</i> <span>${name}</span>';
  var r = convert(content);
  ctx.body = {
    content: convert(content)
  }
})

module.exports = router
