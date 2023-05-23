import React, {useCallback, useRef, useState} from 'react';
import {ModalForm, PageContainer, } from "@ant-design/pro-components";
import {Button, Card, Checkbox, Col, InputNumber, message, Modal,Row, Slider, Space, Table} from "antd";
import {useRequest} from "umi";
import {getAllStudents} from "@/services/data";
import {getSettings, setSettings} from "@/services/admin";
import {useUpdateEffect} from "ahooks";
import {getSumCount} from "@/utils/calculation";
import PieComposition from "@/pages/Dashboard/components/PieComposition";
import './styles.less'
import EditModal from "@/pages/Admin/editInfo/components/editModal";
import { ReloadOutlined } from '@ant-design/icons';
const ExportJsonExcel = require("js-export-excel");

const EditInfo=()=>{
  const {data:allStudentsInfo,run:EditStudentInfo}=useRequest(()=>{
    return getAllStudents()
  })
  const {data:settings,run}=useRequest(()=>{
    return getSettings()
  })
  const [loading,setLoading]=useState(true)
  const [data,setData]=useState([])
  const [isModal,setModal]=useState(false)
  const [settingData,setSettingData]=useState<adminAPI.settingsRes>()
  const [isEditModal,setEditModal]=useState(false)
  const [selectId,setSelectId]=useState<number>()
  const loadingRef=useRef({value:false});
  const columns = [
    {
      title: '姓名',
      dataIndex: 'nickname',
      key: 'name',
      fixed: 'left',
    },
    {
      title: '账号',
      dataIndex: 'username',
      key:'username',
    },
    {
      title: '考勤分数',
      dataIndex: 'daily_score',
      key: 'daily_score',
      sorter: (a:dataAPI.studentScoreInfo, b:dataAPI.studentScoreInfo) => {
        return Number(a.daily_score)>Number(b.daily_score)?1:-1
      }
    },
    {
      title: '讲评分数',
      dataIndex: 'review_score',
      key: 'review_score',
      sorter: (a:dataAPI.studentScoreInfo, b:dataAPI.studentScoreInfo) => {
        return Number(a.review_score)>Number(b.review_score)?1:-1
      }
    },
    {
      title: '期中分数',
      dataIndex: 'middle_score',
      key: 'middle_score',
      sorter: (a:dataAPI.studentScoreInfo, b:dataAPI.studentScoreInfo) => {
        return Number(a.middle_score)>Number(b.middle_score)?1:-1
      }
    },
    {
      title: '作业平均分',
      dataIndex: 'assignments_score',
      key:'assignments_score',
      sorter: (a:dataAPI.studentScoreInfo, b:dataAPI.studentScoreInfo) => {
        return Number(a.assignments_score)>Number(b.assignments_score)?1:-1
      }
    },
    {
      title: '期末分数',
      dataIndex: 'examination_score',
      key:'examination_score',
      sorter: (a:dataAPI.studentScoreInfo, b:dataAPI.studentScoreInfo) => {
          return Number(a.examination_score)>Number(b.examination_score)?1:-1
      }
    },
    {
      title: '总平均分',
      dataIndex: 'average',
      key: 'average',
      sorter: (a:dataAPI.studentScoreInfo, b:dataAPI.studentScoreInfo) => {

        return Number(a.average)>Number(b.average)?1:-1
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_:any,record:dataAPI.studentScoreInfo) => {

        return (
          <Space size="middle">
            <a onClick={()=>{
              setSelectId(record.userId)
              setEditModal(true)
            }}>编辑</a>
          </Space>
        )
      }
    },

  ];

  useUpdateEffect(()=>{
    if(allStudentsInfo&&settings){
      for(let i=0;i<allStudentsInfo.length;i++){
        allStudentsInfo[i].average=getSumCount(allStudentsInfo[i],settings)
      }
      setData(allStudentsInfo)
      setLoading(false)
      setSettingData({...settings})
    }
  },[allStudentsInfo,settings])
  useUpdateEffect(()=>{
    if(allStudentsInfo&&settings){
      for(let i=0;i<allStudentsInfo.length;i++){
        allStudentsInfo[i].average=getSumCount(allStudentsInfo[i],settings)
      }
      setData(allStudentsInfo)
    }
  },[settings])
  const FinishModal=async ()=>{
    // @ts-ignore
    let sumData=settingData.daily_score+settingData.middle_score+settingData.review_score+settingData.assignments_score+settingData.examination_score
    if(sumData===100){
      console.log(settingData)
      // @ts-ignore
      let res=await setSettings(settingData)
      if(res?.code===0){
        message.success(res.msg)
        setModal(false)
        run()
        return true
      }else{
        message.error(res?.msg)
        return false
      }
    }else{
      message.error('分数组成错误')
      return false
    }
    return true
  }
  const buttonClick=()=>{
    setModal(true)
    setSettingData({...settings})
  }
  const changeSlide=(type:string)=>{
    return (e:number)=>{
      // @ts-ignore
      settingData[type]=e
      if(type!=='examination_score'){
        // @ts-ignore
        let sumData=settingData.daily_score+settingData.middle_score+settingData.review_score+settingData.assignments_score
        if(sumData<=100){
          // @ts-ignore
          settingData['examination_score']=100-sumData
        }
      }
      // @ts-ignore
      setSettingData({...settingData})
    }
  }

  const exportExcel=()=>{
    console.log(data)
    let option :{fileName?:string,datas?:any} = {};
    option.fileName ='学生成绩';
    option.datas=[
      {
        sheetData:data,
        sheetFilter: ["username", "nickname","daily_score","review_score","middle_score","assignments_score","examination_score","average"],
        sheetHeader: ["用户名", "姓名","考勤分数","讲评分数","期中分数","作业平均分","期末分数","总平均分"],
      }
    ]
    let toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  const checkBoxChange=()=>{
    // @ts-ignore
    settingData.show_examination=settingData.show_examination?0:1;
    // @ts-ignore
    setSettingData({...settingData})
  }
  const clickIcon=useCallback(async ()=>{
    if(loadingRef.current?.value){return}
    setLoading(true)
    loadingRef.current.value=true
    await EditStudentInfo()
    setLoading(false)
    loadingRef.current.value=false
  },[])

  // @ts-ignore
  return (
    <PageContainer>
      <Card>
        <Button type="primary" style={{marginBottom:'20px',marginRight:'20px'}} onClick={buttonClick} loading={loading} >点击配置分数组成</Button>
        <Button loading={loading} onClick={exportExcel} >点击生成Excel</Button>
        <ReloadOutlined style={{marginLeft:'20px',color:'#1890ff'}} disabled={loading} onClick={clickIcon} />
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey={'userId'}
          scroll={{ x: 1600 }}
          key={'userId'}
          pagination={{
            pageSize:10
          }}
        >
        </Table>
      </Card>

      <ModalForm
        title={'修改分数组成'}
        width={1000}
        submitTimeout={2000}
        open={isModal}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setModal(false),
        }}
        onFinish={FinishModal}
      >
        <Row>
          <Col span={2}>
            <div className={'settings_label'} >考勤</div>
            <div className={'settings_label'} >作业</div>
            <div className={'settings_label'} >期中</div>
            <div className={'settings_label'} >讲评</div>
            <div className={'settings_label'} >期末</div>

          </Col>
          <Col span={7}>
            <Slider
              min={0}
              max={100}
              className={'settings_slider'}
              step={1}
              onChange={ changeSlide('daily_score') }
              value={ settingData?.daily_score}
            />
            <Slider
              min={0}
              max={100}
              className={'settings_slider'}
              step={1}
              onChange={ changeSlide('assignments_score') }
              value={ settingData?.assignments_score}
            />
            <Slider
              min={0}
              max={100}
              step={1}
              className={'settings_slider'}
              onChange={ changeSlide('middle_score') }
              value={ settingData?.middle_score}
            />
            <Slider
              min={0}
              max={100}
              step={1}
              className={'settings_slider'}
              onChange={ changeSlide('review_score') }
              value={ settingData?.review_score}
            />
            <Slider
              min={0}
              max={100}
              step={1}
              onChange={ changeSlide('examination_score') }
              value={ settingData?.examination_score}
            />
          </Col>
          <Col span={3} style={{marginLeft:'10px'}}>
            <InputNumber
              min={0}
              max={100}
              className={'settings_inputNumber'}
              //@ts-ignore
              onChange={ changeSlide('daily_score') }
              value={settingData?.daily_score}
            />
            <InputNumber
              min={0}
              max={100}
              className={'settings_inputNumber'}
              //@ts-ignore
              onChange={ changeSlide('assignments_score') }
              value={settingData?.assignments_score}
            />
            <InputNumber
              min={0}
              max={100}
              className={'settings_inputNumber'}
              //@ts-ignore
              onChange={ changeSlide('middle_score') }
              value={settingData?.middle_score}
            />
            <InputNumber
              min={0}
              max={100}
              className={'settings_inputNumber'}
              //@ts-ignore
              onChange={ changeSlide('review_score') }
              value={settingData?.review_score}
            />
            <InputNumber
              min={0}
              max={100}
              className={'settings_inputNumber'}
              //@ts-ignore
              onChange={ changeSlide('examination_score') }
              value={settingData?.examination_score}
            />


          </Col>
          <Col span={10}>
            <PieComposition settings={settingData} Throttling={300} />
          </Col>
        </Row>
        <Checkbox checked={!!settingData?.show_examination} onChange={checkBoxChange}>展示期末成绩</Checkbox>
      </ModalForm>

      <Modal
        open={isEditModal}
        destroyOnClose={true}
        onCancel={()=>setEditModal(false)}
        footer={null}
        title={'修改学生信息'}
        width={1000}
      >
        <EditModal userId={selectId}></EditModal>
      </Modal>
    </PageContainer>
  )
}

export default EditInfo;
