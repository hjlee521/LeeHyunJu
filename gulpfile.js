var gulp = require("gulp");
var src = ".";
var dist ="./dist";
var port = 7070;
var path = {
    img : {
        src:src+"/images/",
        dist:dist+"/images/",
        exc:"!./src/images/sprite/*.*"
    },
    js : {
        src:src+"/js/main.js",
        dist:dist+"/js/"
    },
    scss :{
        src:src+"/sass/**/*.scss",
        dist:dist+"/css/",
        autoprefixer:dist+"/css/style.css"
    },
    sprite :{
        src:src+"/images/sprite/",
        dist:dist+"/images/sprite/",
        css:src+"/sass/vendor/"
    },
    html:{
        src:src+"/html/**/*.html",
        dist:dist+"/html/",
        exc:"!./dist/html/include/**/*.html"
    }
}

//공용
var browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    runSequence = require('run-sequence'),
    sourcemaps = require("gulp-sourcemaps"),
    gulpWacth = require("gulp-watch"),
    copy = require("copy"),
    del = require("del");




//브라우저 싱크
gulp.task("bs", function(){
    browserSync.init({
        /*proxy: "localhost"*/
        server: {
            baseDir: dist,
            //index:"./html/index.html"
            directory:true
        },
        port:port,
        ui: {
            port: port+1
        }
    });
    gulp.watch(path.js.src,["min-js"]);
    gulp.watch(path.scss.src,["gulp-sass"]);
    gulp.watch(path.sprite.src+"*.*",["sprite-icon"]);
    gulp.watch(path.html.src, ["html-include"]);

    //image watch
    gulp.src(path.img.src+"/**/*.*",{base: path.img.src })
        .pipe(gulpWacth(path.img.src, {base: path.img.src}))
        .pipe(gulp.dest(path.img.dist));
});


//이미지 스프라이트
var spritesmith = require("gulp.spritesmith");
gulp.task("sprite-icon",function(){
	var spriteData = gulp.src(path.sprite.src+"*.*")
		.pipe(spritesmith({
			imgName:"sprite.png",
			cssName:"_sprite.scss",
			padding:5,
			cssTemplate: "sprite.css.handlebars"
		}));
    spriteData.img.pipe(gulp.dest(path.sprite.dist));
	spriteData.css.pipe(gulp.dest(path.sprite.css));
});


//gulp-sass
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");//벤더프리픽스 설정
var dgbl = require("del-gulpsass-blank-lines"); //compact 모드 라인 삭제
gulp.task("gulp-sass", function () {
    return gulp.src(path.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true,outputStyle: "compact"}).on("error", sass.logError))
        .pipe(dgbl()) //compact 라인삭제
        .pipe(autoprefixer({
            browsers: [
                "ie >= 7",
                "last 10 Chrome versions",
                "last 10 Firefox versions",
                "last 2 Opera versions",
                "iOS >= 7",
                "Android >= 4.1"
            ],
            cascade: true,
            remove: false
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(path.scss.dist))
        .pipe(browserSync.stream({match: "**/*.css"}))
        .on("finish",reload);
});


//w3c 테스트
var w3cjs = require("gulp-w3cjs");
gulp.task("w3cjs", function () {
    gulp.src([path.html.dist+"**/*.html",path.html.exc])
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});


//html include
gulp.task("html-include",function () {
    runSequence("clean-html", "gulp-html-tag-include","clean-html-include");
})


//이미지 업데이트
gulp.task("update-image",function(){
  runSequence("clean-image","copy-image","sprite-icon");
});

//js min 파일생성
var minify = require("gulp-minify");
gulp.task("min-js", function() {
    gulp.src(path.js.src)
        .pipe(minify({
            ext:{
                min:".min.js"
            }
        }))
        .pipe(gulp.dest(path.js.dist))
        .on("finish",reload)
});

// 프로젝트 업데이트
gulp.task("update", function(){
    runSequence("html-include","min-js","update-image","gulp-sass","sprite-icon")
});






//webstrom 용 task 구분선
gulp.task("--------------------------------------",function(){
    console.log("empty task");
})

gulp.task("autoprefixer",function(){
    return gulp.src(path.scss.autoprefixer)
        .pipe(autoprefixer({
            browsers: [
                "ie >= 7",
                "last 10 Chrome versions",
                "last 10 Firefox versions",
                "last 2 Opera versions",
                "iOS >= 7",
                "Android >= 4.1"
            ],
            cascade: true,
            remove: false
        }))
        .on("finish",reload);
});

//이미지 압축
/*var imagemin = require("gulp-imagemin");
gulp.task("min-images", function() {
    gulp.src([path.img.src, path.img.exc])
        .pipe(imagemin())
        .pipe(gulp.dest(path.img.dist))
        .on("finish",reload);
});*/

//html include
var include = require("gulp-html-tag-include");
gulp.task("gulp-html-tag-include", function() {
    return gulp.src(path.html.src)
        .pipe(include())
        .pipe(gulp.dest(path.html.dist))
        .on("finish",reload);
});



//이미지 복사
gulp.task("copy-image",function(){
    return copy([path.img.src+"**/*.*"],path.img.dist,function(err,file){
        if(err != null){
            console.log(err);
        }else{
            console.log("complete!!");
        }
    })
});

//clean-image
gulp.task("clean-image",function(){
    return del(path.img.dist)
});

//clean-html
gulp.task("clean-html",function(){
    return del(path.html.dist)
});
//clean-html-include
gulp.task("clean-html-include",function(){
    return del(path.html.dist+"include")
});





