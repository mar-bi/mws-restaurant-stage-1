module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* Preprocessing of Sass files */
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/build/styles.css': 'css/styles.scss'
        }
      }
    },

    /*Generates responsive images to the images directory */
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [
            {
              width: 270,
              separator: '-',
              quality: 50
            },
            {
              width: 400,
              separator: '-',
              quality: 50
            },
            {
              width: 540,
              separator: '-',
              quality: 50
            },
            {
              width: 800,
              separator: '-',
              quality: 50
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ['*.jpg'],
            cwd: 'img/',
            dest: 'build_images/'
          }
        ]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['build_images']
      }
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['build_images']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['sass', 'clean', 'mkdir', 'responsive_images']);
};
