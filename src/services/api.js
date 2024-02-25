import axios from "axios";

const url = 'http://localhost:3000'

/**
 * 查询商品
 * @param {string} path - API路径
 * @returns {Array}     - 查询结果集
 */
export const fetchData = async path => {
  try {
    const response = await axios.get(url + path);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

/**
 * 删除商品
 * @param {string} path - API路径
 * @param {Array} id    - 商品ID数组
 * @returns {Boolean}   - 删除结果
 */
export const deleteData = async (path, id) => {
  try {
    const result = await axios({
      url: url + path,
      method: 'DELETE',
      data: {
        id
      }
    })
    return result.status === 200 ? true : false
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * 上传文件
 * @param {string} path - API路径
 * @param {Array} data  - 数据
 * @returns {Boolean}   - 删除结果
 */
export const upload = async (path, data) => {
  try {
    const result = await axios.post(url + path, data, {
      // 因为axios默认的Content-Type 为json，所以需要修改
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    return result.data.status === 200 ? url + result.data.url : false
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
