//引用AES源码js
import CryptoJS from 'crypto-js'

const key = "Sufaro6666orafuS";// 密钥

/**
 * 数据解密
 * @param {String} ciphertext 已加密数据
 * @returns 解密后的数据
 */
export const Decrypt = ciphertext => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //返回解密结果
  return decryptedData;
}

/**
 * 数据加密
 * @param {*} data 待加密数据
 * @returns 加密后的数据
 */
export const Encrypt = (data) => {
  let ciphertext;
  if (typeof data === "object")
    ciphertext = JSON.stringify(data)
  else
    ciphertext = data
  return CryptoJS.AES.encrypt(ciphertext, key).toString();
}

