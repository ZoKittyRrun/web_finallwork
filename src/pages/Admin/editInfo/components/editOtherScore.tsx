import React, {FC, useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, message} from "antd";
import {reject} from "lodash";
import {changeOtherScore} from "@/services/data";


const editOtherScore:FC<{
  data:dataAPI.studentInfo
  userId:number
}>=({data,userId})=>{
  const [form]=Form.useForm()
  const [loading,setLoading]=useState(false)
  useEffect(()=> {
    form.setFieldsValue({...data})
  },[JSON.stringify(data)])
  const onFinish= async (values:any)=>{
    console.log(values)
    values.userId=userId
    values.daily_score=Number(values.daily_score)
    values.examination_score=Number(values.examination_score)
    values.review_score=Number(values.review_score)
    values.middle_score=Number(values.middle_score)
    setLoading(true)
    let res=await changeOtherScore(values)
    setLoading(false)
    if(res?.code===0){
      message.success('修改成功')
    }
  }
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="考勤分数"
        name="daily_score"
        rules={[{ required: true, message: '请输入考勤分数' },{
          validator: async (_, value) => {
            // eslint-disable-next-line no-param-reassign
            value= Number(value)
            if(value>100||value<0){
              throw new Error('分数不能超过100或小于0')
            }
          }
        }]}
      >
        <Input size={'middle'} type={'number'} ></Input>
      </Form.Item>

      <Form.Item
        label="讲评分数"
        name="review_score"
        rules={[{ required: true, message: '请输入讲评分数' },{
          validator: async (_, value) => {
            // eslint-disable-next-line no-param-reassign
            value= Number(value)
            if(value>100||value<0){
              throw new Error('分数不能超过100或小于0')
            }
          }
        }]}
      >
        <Input size={'middle'} type={'number'} ></Input>
      </Form.Item>
      <Form.Item
        label="期中分数"
        name="middle_score"
        rules={[{ required: true, message: '请输入期中分数' },{
          validator: async (_, value) => {
            // eslint-disable-next-line no-param-reassign
            value= Number(value)
            if(value>100||value<0){
              throw new Error('分数不能超过100或小于0')
            }
          }
        }]}
      >
        <Input size={'middle'} type={'number'} ></Input>
      </Form.Item>
      <Form.Item
        label="期末分数"
        name="examination_score"
        rules={[{ required: true, message: '请输入期末分数' },
          {
            validator: async (_, value) => {
              // eslint-disable-next-line no-param-reassign
              value= Number(value)
              if(value>100||value<0){
                throw new Error('分数不能超过100或小于0')
              }
            }
          }]}
      >
        <Input size={'middle'} type={'number'} ></Input>
      </Form.Item>
      <Form.Item >
        <Button  loading={loading} type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export default editOtherScore;
