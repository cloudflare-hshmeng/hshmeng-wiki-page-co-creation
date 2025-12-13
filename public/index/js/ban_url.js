function randomGarbage(len = 99) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

// 获取当前路径
const currentPath = window.location.pathname

// 去掉最后一段路径，保留前面的
const basePath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1)

// 拼接新的 URL
const garbageURL = basePath + randomGarbage(30)

// 替换浏览器地址栏
history.replaceState(null, "", garbageURL)
