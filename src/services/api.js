import axios from "axios";

const url = 'http://[2409:8a55:48da:5440:59a3:4743:b1b:165c]:3000'

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
