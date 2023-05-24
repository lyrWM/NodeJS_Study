// const csv = require('fast-csv')
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
// const stream = fs.createReadStream(path.join(__dirname, "SURFACE.csv"))
const readStream = fs.createReadStream(path.join(__dirname, 'SURFACE.csv'));

const setAWS = () => {
    return new Promise((resolve, reject) => {
        let AWS_list = []
        readStream.pipe(csv())
            .on('data', (data) => {
                AWS_list.push(data);
            })
            .on('end', () => {
                // console.log(AWS_list);
                console.log("done.. make AWS data..!")
                resolve(AWS_list)
            });
        // csv
        //     .fromStream(stream, { headers: true })
        //     .on("data", function (data) {
        //         AWS_list.push(data);
        //     })
        //     .on("end", function () {
        //         console.log("done.. make AWS data..!")
        //         resolve(AWS_list)
        //     });
    })
}
const main = async () => {
    const AWS_list = await setAWS()
    app.get('/:time', (req, res) => {
        res.send(AWS_list[req.params.time])
    })
    app.listen(3000, () => {
        console.log('start API server at 3000 port!!')
    })
}
main(); 