let cache = {
	box: {},
	debug: false,
	set(key, value) {
		//设置一个key-value对，已存在的key值会被覆盖
		if (this.test(key) && value) {
			this.box[key] = value;
			return true;
		} else {
			throw `key must be string`;
		}
	},
	get(key) {
		//返回key值对应的value
		return this.test(key) ? this.box[key] : null;
	},
	all() {
		//返回整个key-value对象
		return this.box;
	},
	clone() {
		//返回一份独立的缓存数据
		try {
			return JSON.parse(JSON.stringify(this.box));

		} catch (e) {
			console.warn('克隆失败了');
			return false;
		}
	},
	vals() {
		//返回一个包含所有value的数组
		return Object.keys(this.box).map(key => this.box[key])
	},
	keys() {
		//返回一个包含所有key的数组
		return Object.keys(this.box)
	},
	freeze(stamp) {
		//缓存写入localStorage并设置过期时间
		try {
			if (!stamp) {
				throw '缓存必须设置有效期';
			}
			this.setExpire(stamp);
			localStorage.cache = JSON.stringify(this.box);
			return true;
		} catch (e) {
			console.warn(e)
			console.warn('缓存写入失败');
			return false;
		}
	},
	unfreeze() {
		// 从localStorage里重新解析出缓存
		// 如果超过 expire 或 localStorage 不存在 cache 返回 false
		try {
			if (!this.isOK()) {
				this.flush(); //固化缓存过期
				throw '缓存过期';
			}
			if (localStorage.cache && localStorage.cache.length > 0) {
				this.box = JSON.parse(localStorage.cache);
				this.print('缓存已经加载')
				this.print(this.box)
				return true;
			} else {
				throw '缓存已损坏';
			}
		} catch (e) {
			console.warn(e);
			return false;
		}
	},
	flush() {
		// 清空缓存
		this.box = {};
		localStorage.cache = '';
		localStorage.stamp = 0;
		this.print('缓存已经清空');
	},
	test(key) {
		//检测一个key是否合法
		return key ? typeof key == 'string' && key.length > 0 : false;
	},
	setExpire(stamp) {
		//设置本地缓存过期时间
		/* 	{
		 *		unit:'days' or 'hours' or 'minutes' or 'seconds' 
		 *		value:10,
		 *	}
		 *	过期时间参数例子
		 */
		let choic = ['seconds', 'hours', 'minutes', 'days'];
		let {
			unit,
			value
		} = stamp;
		if (unit && typeof unit == 'string' && choic.includes(unit)) {
			if (value && typeof value == 'number') {
				value = value * 1000;
				let map = {
					'seconds': value,
					'minutes': value * 60,
					'hours': value * 3600,
					'days': value * 3600 * 24,
				}
				localStorage.stamp = Date.now() + map[unit];
			} else {
				throw `value must be number`;
			}
		} else {
			throw `不支持的单位${unit},时间支持的单位为${choic.join(',')}`;
		}
	},
	isOK() {
		//检测固化缓存是否再合法日期内
		let stamp = localStorage.stamp;
		try {
			stamp = new Number(stamp);
		} catch (e) {
			return false;
		}
		return Date.now() < stamp ? true : false;
	},
	print(msg) {
		//控制台调试
		if (this.debug) {
			console.log(msg);
		}
	}
}