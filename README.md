# 前端 key-value cache
### 简介
本cache简单的使用了一个 `Object` 的实列来存储信息，可以通过定义的api来访问这些数据，api的命名是从 `Redis` 搬过来的。持久化方面基于 `localstorage` 实现，所以应该注意其存储数量的限制。下面给出了一个使用骨架。
```javascript
if(cache.unfreeze()){
    // 如果缓存失效了，你可以重新调用后端请求，并重设数据
    let data = get;
    cache.set('data',data);

    // 通过freeze可以将内存中的数据固化到磁盘上
    // 可以在下次通过unfreeze重新加载缓存
    // unfreeze接受一个表明过期的时间的对象，下面的对象表明了缓存将在30分钟后过期
    cache.freeze({
        unit:"minutes",
        value:30,
    });    
}else{
    // 缓存未失效，正常读取缓存
}
```

### Api
- set(key,value)

- get()

- all()

- clone

- keys()

- vals()

- freeze(stamp)

- unfreeze()

- flush()

- isOk()

- teest(key)

- setExpire(stamp)

- print()

### 缓存有效期和粒度
缓存的有效是作用在整个cache上的，不支持对单独的键值对添加有效期。有效期的检测通常只在调用 `unfreeze` 从localstorage中加载缓存时触发，get,set等函数不检测有效期，这也就意味着，如果标签页不关闭，那缓存总是有效的。你也可以手动调用 `isOK` 函数来判断当前缓存是否过期了。