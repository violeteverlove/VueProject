module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    filenameHashing: false,
    devServer: {
        // Proxy: {
        //     '/api': {
        //         target: '',  //后端端口
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': '/'
        //         }
        //     },
        //     '/foo': {
        //         target: '<other_url>'
        //     }
        // }
    },
}