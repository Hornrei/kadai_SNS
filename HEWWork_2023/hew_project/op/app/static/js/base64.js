export  function base64ToArray(data){
  let rawByte = atob(data);
  let _return = new Uint8Array(rawByte.length)
  for (let i = 0; i < rawByte.length; i++) {
    _return[i] = rawByte.charCodeAt(i);
  }
  return _return
}



export  function arrayToBase64(data){
  const u8Array = new Uint8Array(data);
  const _return = btoa(String.fromCharCode(...u8Array));
  return _return
}

