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
                entry: path.resolve('frontend/src/js/main'),
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
                        },
                        {
                            test: /\.html/,
                            loader: 'html-loader'
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
                        path.resolve('frontend/src/js')
                    ],
                    extensions: [
                        '',
                        '.js',
                        '.json'
                    ]
                }
            }
        },


        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none',
                    loadPath: [
                        './frontend/src/scss/',
                        './node_modules/bootstrap-sass/assets/stylesheets'
                    ],
                    'default-encoding': 'utf-8'
                },
                files: [
                    {
                        './frontend/public/css/styles.css': './frontend/src/sass/styles.scss'
                    }
                ]
            }
        },

        cssmin: {
            clean: {
                options: {
                    report: 'min'
                },
                files: {
                    './frontend/css/styles.css': './frontend/css/styles.css'
                }
            }
        },

        watch: {
            sass: {
                files: ['./frontend/src/**/*.scss'],
                tasks: ['sass']
            },
            options: {
                livereload: {
                    host: 'localhost',
                    port: 35732
                }
            }
        },

        connect: {
            server: {
                options: {
                    base: [
                        "./workfiles/",
                        "./frontend/public/"
                    ],
                    open: true,
                    port: 13338,
                    hostname: '*'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build', [
        'webpack',
        'sass',
        'cssmin',
        "uglify"
    ]);

    grunt.registerTask('devCss', [
        'sass',
        'connect',
        'watch'
    ]);

    grunt.registerTask('dev', [
        "webpack",
        "keepalive"
    ]);

};
