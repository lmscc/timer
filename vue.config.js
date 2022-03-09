const WebpackBar = require('webpackbar');
module.exports = {
     publicPath: process.env.NODE_ENV === 'production'
    ? '/timer/'
    : '/timer/',  
    pages: {
      index: {
        // page 的入口
        entry: 'src/main.js',
        // 模板来源
        template: 'public/index.html',
        // 在 dist/index.html 的输出
        filename: 'index.html',
      },
    },
    // //关闭语法检查
    lintOnSave:false,
    outputDir:'bundle',
    productionSourceMap:false,
    configureWebpack:config=>{
        return{
            // optimization:{
            //     splitChunks:{
            //         cacheGroups:{
            //             'element-ui':{
            //                 test:/[\\/]node_modules[\\/]element-ui/,
            //                 // 默认是async,只打包异步引入的 即import()
            //                 chunks :'all',
            //                 reuseExistingChunk:true,
            //                 // priority: 20,
            //             }
            //         }
            //     }
            // },
            plugins:[
                //进度条
                new WebpackBar(),
                //按需引入组件
               
            ]
        }
    }
    //开启代理服务器
//    devServer:{
//      proxy:'http://localhost:3000'
//    }
  }