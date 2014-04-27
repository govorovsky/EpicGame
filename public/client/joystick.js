require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
	    jquery: "/js/lib/jquery",
        underscore: "/js/lib/underscore",
        backbone: "/js/lib/backbone",
        Connector: "/js/lib/Connector",
        FnQuery: "/js/lib/FnQuery",
        "socket.io": "/socket.io/socket.io"
    },
    shim: {
	    'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "socket.io": {
            exports: "io"
        }
    }
});

require(['js/lib/Connector.js'], function(Connector) {

	window.addEventListener("devicemotion", move, false);
	window.addEventListener('orientationchange', changeOrient);
	window.addEventListener('touchstart', touch);

	var message = document.getElementById('message');
	var input = document.getElementById('token');
	var start, init, reconnect;

	// Создаем связь с сервером
	var server = new Connector({
			server: ['bind'],
			remote: '/player'
		}
	);

	// Инициализация
	init = function(){
		message.innerHTML = 'ready';
		// Если id нет
		if (!localStorage.getItem('playerguid')){
			// Ждем ввода токена
			input.parentNode.addEventListener('submit', function(e){
				e.preventDefault();

				// И отправляем его на сервер
				server.bind({token: input.value}, function(data){
					if (data.status == 'success'){ //  В случае успеха
						// Стартуем джостик
						start(data.guid);
					}
				});
			}, false);

		} else { // иначе
			// переподключаемся к уже созданной связке
			reconnect();
		}
	};

	// Переподключение
	// Используем сохранненный id связки
	reconnect = function(){
		server.bind({guid: localStorage.getItem('playerguid')}, function(data){
			// Если все ок
			if (data.status == 'success'){
				// Стартуем
				start(data.guid);
			// Если связки уже нет
			} else if (data.status == 'undefined guid'){
				// Начинаем все заново
				localStorage.removeItem('playerguid');
				init();
			}
		});
	};

    function changeOrient() {
        if (window.orientation % 90 == 0) {
            console.log('portrait');
            server.send({
                orient: 'portrait'
            });
        } else {
            server.send({
                orient: 'landscape'
            });
        }
    };

    function move(evt) {

    	var xSpeed =  evt.acceleration.x;
    	var ySpeed = -evt.acceleration.y;
        server.send({
            type: 'accel',
            xs: xSpeed,
            ys: ySpeed
      
        });
        //console.log(alpha,betta,gamma);
    };

    function touch(evt) {
        server.send({
            type: 'touch',
      
        });
        //console.log(alpha,betta,gamma);
    };

	// Старт игры
	start = function(guid){
		console.log('start player');
		// Сохраняем id связки
		localStorage.setItem('playerguid', guid);
		message.innerHTML = 'game';
	};

	server.on('reconnect', reconnect);

	init();

	// Обмен сообщениями
	server.on('message', function(data, answer){
		console.log('message herere', data);
		answer(data);
	});

	window.server = server;

	/*
	server.send('message', function(answer){
		console.log(answer);
	});
	*/
});