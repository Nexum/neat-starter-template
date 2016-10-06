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
                    'default-encoding': 'utf-8'
                },
                files: [
                    {
                        './frontend/css/styles.css': './frontend/src/sass/styles.sass'
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
                files: ['./frontend/src/**/*.sass'],
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
                    base: "./workfiles/",
                    open: {
                        target: 'http://localhost:8001/'
                    },
                    port: 8001,
                    hostname: '*'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
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
