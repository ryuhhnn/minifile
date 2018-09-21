const CleanCSS = require('clean-css')
const UglifyJS = require("uglify-js")
const fs = require('fs')

let css_files = []
let js_files = []
let output_js = ''
let output_path = ''

$('#loader').hide()

$('#output-directory').change(function() {
    output_path = document.getElementById('output-directory').files[0].path
})

// Minify all JS files
function minify_js_files() {
    fs.writeFile(`${output_path}/output-js.min.js`, output_js, function (err) {
        if (err) {
            window.alert('There was an issue exporting your JS files')
            return console.error(err)
        }

        $('#loader').hide()
        window.alert('Successfully minified JavaScript files!')
        js_files = []
    })
}

document.addEventListener('dragover', function (e) {
    e.preventDefault()
    e.stopPropagation()

    // Change background color on mouseover
    $('body').css('background-color', '#f3f3f3')
})

document.addEventListener('drop', function (e) {
    e.preventDefault()
    e.stopPropagation()

    // Change background color back
    $('body').css('background-color', '#fff')

    // Ensure the user chooses an output path before trying to minify files
    if (output_path === '') {
        return window.alert('You must first specify an output path!')
    }

    // Add all input files to their respective arrays
    for (let f of e.dataTransfer.files) {
        if (f.path.match('.css$')) {
            css_files.push(f.path)
        } else if (f.path.match('.js$')) {
            js_files.push(f.path)
        } else {
            window.alert('File type not supported for: ' + f.path)
        }
    }

    // Combine all JS into one file
    if (js_files.length) {
        let count = 0
        $('#loader').show()
        for (let f of js_files) {
            fs.readFile(f, 'utf8', function(err, contents) {
                let result = UglifyJS.minify(contents)
                if (result.error) {
                    console.error(result.error)
                }
                output_js += result.code
                count++
                if (count > js_files.length - 1) minify_js_files()
            })
        }
    }

    // Minify all CSS files
    if (css_files.length) {
        new CleanCSS({rebase:false}).minify(css_files, function (error, output) {
            fs.writeFile(`${output_path}/minified-css.min.css`, output.styles, function (err) {
                if (err) {
                    window.alert('There was an issue exporting your CSS files')
                    return console.error(err)
                }
            })
            window.alert('Successfully minified CSS files!')
            css_files = []
        })
    }
})

document.addEventListener('dragover', function (e) {
    e.preventDefault()
    e.stopPropagation()
})