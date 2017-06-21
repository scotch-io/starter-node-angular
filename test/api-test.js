const chai = require('chai')
const http = require('chai-http')
const api = require('../app')
const should = chai.should()

chai.use(http);

describe('API GET Requests', function(done) {

    it('should return one user on /users/db/:name', function(done) {
        chai.request(api)
            .get('/users/db/Frank')
            .end(function(err, response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body[0].should.have.property('name');
                response.body[0].name.should.equal('Frank');
                done();
            })
    });
    it('should return all users on /users/db', function(done) {

        chai.request(api)
            .get('/users/db')
                .end(function(err, response) {
                    response.should.be.json;
                    response.body.should.be.a('array');
                    done();
                })
    })

});

