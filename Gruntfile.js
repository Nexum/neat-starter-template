var path = require("path");

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            bundle: {
                options: {
                    mangle: true,
                    compress: true,
                    beautify: false,
                    sourceMap: false,
                    preserveComments: false,
                    report: "min",
                    except: []
                },
                files: {
                    'frontend/public/js/bundle.js': ['frontend/public/js/bundle.js']
                }
            }
        },

        webpack: {
            bundle: {
                entry: path.resolve('frontend/src/main'),
                watch: true,
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['es2015']
                            },
                            exclude: /node_modules|templates/
                        }
                    ]
                },
                output: {
                    path: path.resolve("frontend/public/js"),
                    publicPath: "/js/",
                    filename: 'bundle.js'
                },
                resolveLoader: {
                    root: path.resolve('node_modules')
                },
                resolve: {
                    root: [
                        path.resolve('frontend/src')
                    ],
                    extensions: [
                        '',
                        '.js',
                        '.json'
                    ]
                }
            }
        },

        ape_deploy: {
            view: {
                options: {
                    stage: "view",
                    name: "base",
                    redisDb: 0,
                    nodejs: true,
                    ignoreFiles: [".deployignore"],
                    servers: [
                        {
                            host: "dummy.ams.to",
                            user: "ape",
                            root: "/home/ape"
                        }
                    ],
                    links: {
                        "data": "data"
                    }
                }
            },
            prod: {
                options: {
                    stage: "prod",
                    name: "base",
                    redisDb: 0,
                    nodejs: true,
                    ignoreFiles: [".deployignore"],
                    servers: [
                        {
                            host: "dummy.ams.to",
                            user: "ape",
                            root: "/home/ape"
                        }
                    ],
                    links: {
                        "data": "data"
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-keepalive');

    grunt.registerTask('build', [
        'webpack',
        "uglify"
    ]);

    grunt.registerTask('dev', [
        "webpack",
        "keepalive"
    ]);

};
