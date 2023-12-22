import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/patient.query.js';

const HttpStatus = {
    OK: {code: 200, status: 'OK'},
    CREATED: {code: 201, status: 'CREATED'},
    NO_CONTENT: {code: 204, status: 'NO CONTENT'},
    BAD_REQUEST: {code: 400, status: 'BAD_REQUEST'},
    NOT_FOUND: {code: 404, status: 'NOT_FOUND'},
    INTERNAL_SERVER_ERROR: {code: 500, status: 'INTERNAL_SERVER_ERROR'},
};

export const getPatients = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patients...`);
    database.query(QUERY.SELECT_PATIENTS, (error, results) => {
        if(error){
            logger.error(error.message);
        }else{
            if(!results){
                res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No patients found`))
            }else{
                res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Successfully fetched patients`, {patients: results}));
            };
        }
    })
}

export const createPatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, creating patients...`);
    database.query(QUERY.CREATE_PATIENT, Object.values(req.body), (error, results) => {
        if(!results){
            logger.error(error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error Occurred`))
        }else{
            const patient = {id:results.insertedID, ...req.body, created_at: new Date()};
            res.status(HttpStatus.CREATED.code).send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Patient created`, {patient}));
        };
    })
}

export const getPatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient...`);
    database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
        if(error){
            logger.error(error.message);
        }else{
            if(!results[0]){
                res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient ID '${req.params.id}' Not Found`))
            }else{
                const patient = {id:results.insertedID, ...req.body, created_at: new Date()};
                res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient fetched`, results[0]));
            };
        };
    })
}

export const updatePatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient...`);
    database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, results) => {
        if(error){
            logger.error(error.message);
        }else{
            if(!results[0]){
                res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient ID '${req.params.id}' Not Found`))
            }else{
                logger.info(`${req.method} ${req.originalUrl}, updating patient...`);
                database.query(QUERY.UPDATE_PATIENT, [...Object.values(req.body), req.params.id], (error, results) => {
                    if(!error){
                        res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient Updated`, {id: req.body.id, ...req.body}))
                    } else {
                        logger.error(error.message);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error Occurred`));
                    }
                })
                // const patient = {id:results.insertedID, ...req.body, created_at: new Date()};
                // res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient fetched`, results[0]));
            };
        };
    })
}

export const deletePatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, deleting patient...`);
    database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, results) => {
        if(error){
            logger.error(error.message);
        }else{
            if(results.affectedRows>0){
                res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient deleted`, results[0]));
            }else{
                res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient ID '${req.params.id}' Not Found`))
            };
        };
    })
}

export default HttpStatus;