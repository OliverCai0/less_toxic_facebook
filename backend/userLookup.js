const p1 = 109;
const p2 = 198733;

function hash(s){
    hash_val = 0;
    for(var i = 0; i < s.length; i++){
        hash_val += s.charCodeAt(i);
        hash_val *= p1;
        hash_val %= p2;
    }
    return hash_val
}

const addUser = (db, inputs) => {
    console.log(inputs);
    const query_string = 'INSERT INTO users(id, name, email, password, classes) VALUES(?,?,?,?,?)';
    const id = hash(inputs.name + inputs.email);
    const data = [id, inputs.name, inputs.email, inputs.password, ""];
    console.log(data);
    db.run(query_string, data, (err) => {
        if(err) {
            return console.log(err.message); 
        }
    })
}   

const addClasses = (db, inputs) => {
    console.log(inputs);
    const query_string = 'UPDATE users SET classes=classes || ? WHERE id=?';
    const data = [inputs.classes, id];
    console.log(data);
    db.run(query_string, data, (err) => {
        if(err) {
            return console.log(err.message); 
        }
    })
}   

const getUsers = (db) => {
    return new Promise((resolve, reject) => {
        var search_results = [];
        var sql = "SELECT * FROM users";
        return db.each(sql, (error, row) => {
            search_results.push(row);
        }, () => {resolve(search_results)});

    })
}

module.exports.addUser = addUser
module.exports.addClasses = addClasses
module.exports.getUsers = getUsers 
