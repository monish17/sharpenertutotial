const path=require('path');
const root=require('../helper functions/path');

exports.getPageNotFound=(req,res,next)=>{
    res.status(404).sendFile(path.join(root,'views','pageNotFound.html'));
}