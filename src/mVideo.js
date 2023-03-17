//引入express框架
const express = require('express');
const { response } = require('express');
var fs = require('fs');
//引入路径处理模块
const path = require('path')
const bodyParser = require('body-parser');
var querystring = require('querystring');
var session = require('express-session')

//创建web服务器  原来的http.createServer
const app = express();

//静态资源访问服务器功能 公开指定目录
// app.use(express.static(path.join(__dirname, 'public')));
//接收多个路劲字符串参数，把路径参数拼接起来然后再执行一下normalize
// app.use('/public', express.static('./public/'))
//拦截所有的请求
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
}
)
app.use(bodyParser.json({ limit: '1mb' }));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'itlike',//加密字符串
    name: 'likeid',//返回客户端key的名称，默认为connect_sid
    resave: false,//强制保存session，即使它没有变化
    saveUninitialized: true,//强制将未初始化的session存储。当新建一个session且未设定属性或值时，它就处于未初始化状态。在设定cookie前，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的，默认为true
    cookie: { maxAge: 24 * 3600 },//一天
}));



app.get('/', (req, res) => {
    res.send('hello node123');
})
app.get('/about', function (req, res) {
    fs.readFile("./JsonData/users.json", function (err, data) {
        let user = data.toString();	//将Buffer转换成字符串
        // user = JSON.parse(user);		//将数据转换为 JavaScript对象。 
        // console.log(user);
        res.send(user)
    })
})
app.get('/register', function (req, res) {
    console.log(typeof (req));
    //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
    // let str = JSON.stringify(req.body);
    console.log(req.query);
    var a = req.query.records = [];
    var b = req.query.collect = [];
    console.log(a, '初始化', b);
    fs.readFile("./JsonData/users.json", function (err, data) {
        let user = JSON.parse(data);
        console.log(user);
        console.log(typeof (user));
        user.users.push(req.query)
        console.log(user);
        let str = JSON.stringify(user);
        fs.writeFile(path.resolve(__dirname, '..' + "/src/JsonData/users.json"), str, function (err,
            data) {
            if (err) {
                console.error(err);
            }
            console.log('----------新增成功-------------');
        })
    })
    res.send(req.query)

})
app.get('/videoList', function (req, res) {
    fs.readFile("./JsonData/videoList.json", function (err, data) {
        let user = data.toString();	//将Buffer转换成字符串
        // user = JSON.parse(user);		//将数据转换为 JavaScript对象。 
        // console.log(user);
        res.send(user)
    })
})
//修改密码
app.get('/redirect', function (req, res) {
    console.log(req.query);
    console.log(typeof req.query);
    fs.readFile("./JsonData/users.json", function (err, data) {
        let user = JSON.parse(data);
        console.log(user);
        for (let i in user.users) {
            if (user.users[i].userName === req.query.userName) {
                // console.log(i);
                user.users[i].password = req.query.password
                console.log(user.users[i].password);
                let str = JSON.stringify(user);
                fs.writeFile(path.resolve(__dirname, '..' + "/src/JsonData/users.json"), str, function (err,
                    data) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('----------新增成功-------------');
                }); break

            }
        }
        res.send(user)
    })
})
//添加浏览历史
app.get('/updateRecords', function (req, res) {
    console.log(req.query)
    fs.readFile("./JsonData/users.json", function (err, data) {
        let user = JSON.parse(data);
        let records = JSON.parse(req.query.records)
        console.log(user);
        for (let i in user.users) {
            if (user.users[i].userName === req.query.userName) {
                // console.log(i);
                user.users[i].records.push(records)
                console.log(user.users[i].records);
                let str = JSON.stringify(user);
                fs.writeFile(path.resolve(__dirname, '..' + "/src/JsonData/users.json"), str, function (err,
                    data) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('----------新增成功-------------');
                }); break

            }
        }
        res.send('添加成功')
    })
})
app.get('/collectVideo', function (req, res) {
    console.log(req.query);
    fs.readFile("./JsonData/users.json", function (err, data) {
        let user = JSON.parse(data);
        let collect = JSON.parse(req.query.collect)
        console.log(user);
        for (let i in user.users) {
            if (user.users[i].userName === req.query.userName) {
                // console.log(i);
                user.users[i].collect.push(collect)
                console.log(user.users[i].collect);
                let str = JSON.stringify(user);
                fs.writeFile(path.resolve(__dirname, '..' + "/src/JsonData/users.json"), str, function (err,
                    data) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('----------新增成功-------------');
                }); break

            }
        }
        res.send('添加成功')
    })
})
app.get('/delVideo', function (req, res) {
    console.log(req.query);
    fs.readFile("./JsonData/users.json", function (err, data) {
        let user = JSON.parse(data);
        let collect = JSON.parse(req.query.collect)
        // console.log(user);
        for (let i in user.users) {
            if (user.users[i].userName === req.query.userName) {
                // console.log('进来成功');
                for (let j in user.users[i].collect) {
                    if (user.users[i].collect[j].desVal === collect.desVal) {
                        console.log('匹配成功');
                        let collect = user.users[i].collect;
                        console.log('######', collect);
                        collect.splice(j, 1);
                        console.log('删除之后的收藏列表', user.users[i].collect);
                    }
                }
                //         // console.log(i);
                //         user.users[i].collect.push(collect)
                //         console.log(user.users[i].collect);
                let str = JSON.stringify(user);
                fs.writeFile(path.resolve(__dirname, '..' + "/src/JsonData/users.json"), str, function (err,
                    data) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('----------删除成功-------------');
                }); break

            }
        }
        res.send('添加成功')
    })
})

app.listen(8000, () => {
    console.log('is running');
})