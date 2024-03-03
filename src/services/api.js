import axios from "axios";
import { api } from 'boot/axios'

// const url = 'http://localhost:3000'

/**
 * 查询商品
 * @param {string} path - API路径
 * @returns {Array}     - 查询结果集
 */
export const fetchData = async path => {
  try {
    const result = await api.get(path);
    // console.log(result);
    return result.data;
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
    const result = await api({
      url: path,
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
    const result = await api.post(path, data, {
      // 因为axios默认的Content-Type 为json，所以需要修改
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    return result.data.status === 200 ? result.data.url : false
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * 编辑信息
 * @param {string} path - API路径
 * @param {Array} data  - 数据
 * @returns {Boolean}   - 删除结果
 */
export const updateData = async (path, data) => {
  try {
    const result = await api.post(path, data)
    return result.data.status === 200 ? true : false
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
