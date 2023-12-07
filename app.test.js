const request = require('supertest');
const app = require('./server')

describe('GET /', function () {
    it('responds with 200', function (done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});


describe('POST /user/createUser', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/user/createUser')
            .send({
                "userName": "vishnu3",
                "designation": "engineer",
                "age": "29"
            })
            .expect(200, done);
    });
});

describe('POST /user/createTransaction', function () {
    it('responds with json', function (done) {
        request(app)
            .post('/user/createTransaction')
            .send({
                "userId": "651bcae74f89d602b370dabf",
                "item": "itemC",
                "date": "2023-10-02",
                "amount": "100"
            })
            .expect(200, done);
    });
}); 

describe('GETs /user/transactionByUserId', function () {
    it('responds with json', function (done) {
        request(app)
            .get('/user/transactionByUserId')
            .query({
                userId: '651bcae74f89d602b370dabf',
                startDate:'2023-10-02',
                endDate: '2023-10-03',
                minAmount:'',
                maxAmount:'',
                page:1
            })
            .expect(200, done);
           
    });
}); 