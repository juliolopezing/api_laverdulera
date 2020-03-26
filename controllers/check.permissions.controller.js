exports.checkPermissions = async function(permissions, code){
	let size = permissions.length
	let doProcess = false
	for(let i=0; i<size; i++){
		if(permissions[i].code == code){
			doProcess = true
			break
		}
	}
	return doProcess
}