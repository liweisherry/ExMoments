// catch the error in the async functions
module.exports = func => {
    return(req, res,next) => {
        func(req, res, next).catch(next);
    }
}