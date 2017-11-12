const router = require('koa-router')();
const { convertState, convertHTML } = require('../scripts/convert');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  });
});

/**
 * request params
 * content
 */
router.post('/convert', async (ctx, next) => {
  const reqBody = ctx.request.body;
  const { content } = reqBody;
  try {
    const rst = {
      content: convertHTML(content),
      contentState: convertState(content)
    };
    ctx.body = {
      ...rst,
      success: true
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      err: error.toString(),
      success: false
    };
  }
});

module.exports = router;
