module.exports.counter = function(action){
    counter_value = document.getElementById('counter').innerText
    counter_value = parseInt(counter_value)
    switch(action) {
        case "increment" :
            counter_value++
            break
        case "decrement" :
            if( counter_value > 0 ){
                counter_value--
            }
            break
        case "reset" :
            counter_value = 0
            break
        case "currentValue" :
            counter_value = localStorage.getItem('counter') || 0
            break
    }
    document.getElementById("counter").innerText = counter_value
    localStorage.setItem('counter', counter_value)
}
