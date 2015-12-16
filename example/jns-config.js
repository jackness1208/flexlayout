module.exports = {
    // 压缩用配置参数
    optimize: {
        // sass
        sass: {
            demo: {
                files: {
                    'css/index.css': 'sass/index.scss'
                }
            }
        }
    },

    devDependencies: [
        'grunt-contrib-sass'
    ]
}
