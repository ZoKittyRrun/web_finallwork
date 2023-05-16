import React, {FC, useEffect} from 'react';
import {FooterToolbar, PageContainer, ProFormList, ProFormGroup} from "@ant-design/pro-components";
import {Button, Card, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space,FloatButton} from "antd";

import {useRequest} from "umi";
import {addAssignments, getAllStudents} from "@/services/data";
import {ExclamationCircleFilled} from "@ant-design/icons";
const { confirm } = Modal;
const addAssignment: FC = () => {
  const {data: initValue, loading: isLoading} = useRequest(() => {
    return getAllStudents();
  })
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({'value': initValue})
  }, [initValue])

  const onFinish =  (value:dataAPI.addAssignmentsParams)=>{
    console.log(value)
    confirm({
      title: '确定添加新的作业吗',
      icon: <ExclamationCircleFilled />,
      content: '新的作业提交后无法撤销',
      async onOk() {
        let res=await addAssignments(value)
        if(res?.code===0){
          message.success(res.msg)
          return res
        }
      },

    });
  }
  return (
    <PageContainer>
      <Card loading={isLoading}>
        <Form<dataAPI.studentScoreInfo>
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col xl={4}>
              <h4>账号</h4>
            </Col>
            <Col xl={4}>
              <h4>用户名</h4>
            </Col>
            <Col xl={4}>
              <h4>成绩</h4>
            </Col>
          </Row>
          <Form.List name={'value'}>
            {(fields) =>
              fields.map((field, index) => {
                return (
                  <Form.Item key={field.key} noStyle >
                    <Row gutter={24}  align="middle">
                      <Col xl={4}>
                        <Form.Item
                          {...field}
                          key={'username' + index}
                          // name={[field.name, 'username']}
                        >
                           <pre>{form.getFieldValue('value')[index]['username']}</pre>
                        </Form.Item>
                      </Col>
                      <Col xl={4}>
                        <Form.Item
                          {...field}
                          key={'nickname' + index}
                          name={[field.name, 'nickname']}
                        >
                          <pre>{form.getFieldValue('value')[index]['nickname']}</pre>

                        </Form.Item>
                      </Col>
                      <Col xl={4}>
                        <Form.Item
                          {...field}
                          key={'score' + index}
                          name={[field.name, 'score']}
                          initialValue={0}

                        >
                          <InputNumber  min={0} max={100} style={{minWidth:'200px'}}/>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>

                )
              })

            }
          </Form.List>
          <FloatButton.BackTop />
          <Form.Item>
            <Button type={'primary'} htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )

}
export default addAssignment;
