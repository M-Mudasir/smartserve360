const asyncErrorhandler = (asyncFunc) =>{
    return (req,res,next)=>{
   Promise.resolve(asyncFunc(req,res,next)).catch(next)
    }
}

module.exports = asyncErrorhandler