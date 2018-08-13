module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    /* Configuration for concatinating files */
    concat: {
      dist: {
        src: ["js/*.js"],
        dest: "js/build/production.js"
      }
    },

    /* Minification of the production.js file */
    uglify: {
      build: {
        src: "js/build/production.js",
        dest: "build/js/production.min.js"
      }
    },

    /* Preprocessing of Sass files */
    sass: {
      dist: {
        options: {
          style: "compressed"
        },
        files: {
          "build/css/styles.css": "css/styles.scss"
        }
      }
    },

    /*Generates responsive images to the images directory */
    responsive_images: {
      dev: {
        options: {
          engine: "im",
          sizes: [
            {
              width: 270,
              separator: "-",
              quality: 50
            },
            {
              width: 400,
              separator: "-",
              quality: 50
            },
            {
              width: 540,
              separator: "-",
              quality: 50
            },
            {
              width: 800,
              separator: "-",
              quality: 50
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ["*.jpg"],
            cwd: "img/",
            dest: "build/images/"
          }
        ]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ["build/images"]
      }
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ["build/images"]
        }
      }
    },

    /* Copy html files to build/ folder */
    copy: {
      dev: {
        files: [
          {
            expand: true,
            src: "**/*.html",
            dest: "build/"
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-responsive-images");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-mkdir");
  grunt.loadNpmTasks("grunt-contrib-copy");
  //grunt.registerTask('default', ['concat', 'uglify', 'sass', 'clean', 'mkdir', 'responsive_images', 'copy']);
  grunt.registerTask("default", ["clean", "mkdir", "responsive_images"]);
};
