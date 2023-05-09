import {PageContainer} from "@ant-design/pro-components";
import React, {FC, useCallback, useEffect, useState} from "react";
import {Card, Col, Row, Skeleton, Statistic, Modal} from "antd";
import {Avatar} from "antd";
import styles from '../style.less';
import {useRequest} from "@@/exports";
import {getUserInfo} from "@/services/user";
import {getStudentInfoById, getAverage} from "@/services/data";
import {useUpdateEffect} from "ahooks";
import {getSettings} from "@/services/admin";
import {getSumCount} from "@/utils/calculation";
import PieComposition from "@/pages/Dashboard/components/PieComposition";
import LineComposition from "@/pages/Dashboard/components/LineComposition";
import AssignmentsTable from "@/pages/Dashboard/components/AssignmentsTable";
import {LeftOutlined} from "@ant-design/icons";


const PageHeaderContent: FC<{
  currentUser: userAPI.userInfo,
  isAdmin: boolean,
  isLoading: boolean,
  setSelectedStudent: (id: number) => void
}> = ({currentUser, isLoading,isAdmin,setSelectedStudent}) => {
  if (isLoading) {
    return <Skeleton avatar paragraph={{rows: 1}} active/>;
  }
  const returnList=useCallback(()=>{
    setSelectedStudent(0)
  },[])
  return (
    <>
      {
        isAdmin===1 && <a
          style={{display:'block',marginBottom:'10px'}}
          onClick={returnList}
        ><LeftOutlined />返回列表页</a>
      }
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={currentUser.avatar}/>
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            {currentUser.nickname}
          </div>
          <div>
            {/*{currentUser.title} |{currentUser.group}*/}
          </div>
        </div>
      </div>
    </>

  );
};

const ExtraContent: React.FC<{
  studentInfo: dataAPI.studentInfo,
  setting: adminAPI.settingsRes,
  isLoading: boolean
}> = ({studentInfo, setting, isLoading}) => {
  if (isLoading) return (<Skeleton active/>)
  return (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <Statistic title="平均分数" value={getSumCount(studentInfo, setting)}/>
      </div>
    </div>
  )
}

const Dashboard: FC<{
  id?: userAPI.userInfo,
  isAdmin?: boolean,
  setSelectedStudent?: (id: number) => void
}> = ({id,isAdmin,setSelectedStudent}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const {data: currentUser} = useRequest(() => {
    return getUserInfo();
  });
  const {data: studentMsg,run} = useRequest((id) => {
    return getStudentInfoById(id);
  },{
    manual: true
  });
  const {data: setting} = useRequest(() => {
    return getSettings();
  })
  const {data: average} = useRequest(() => {
    return getAverage();
  })
  useEffect(()=>{
    if(isAdmin){
      run(id)
    }else {
      // @ts-ignore
      run()
    }
  },[id])
  useUpdateEffect(() => {
    if (currentUser && studentMsg && setting && average) {
      setLoading(false)
    }
  }, [currentUser, studentMsg, setting, average])
  return (
    <PageContainer
      content={
        <PageHeaderContent
          isAdmin={isAdmin}
          setSelectedStudent={setSelectedStudent}
          currentUser={studentMsg || currentUser}
          isLoading={isLoading}
        />
      }
      extraContent={<ExtraContent
        studentInfo={studentMsg}
        setting={setting}
        isLoading={isLoading}
      />}
    >
      <Row gutter={[24, 60]}
           style={{
             marginTop: 24,
           }}>
        <Col xl={16} lg={24} md={24} xs={24} span={6}>
          <Card
            title={"各科分数"}
            hoverable
            style={{marginBottom: 24}}
          >
            <Row gutter={24}>
              <Col xl={6} lg={12} md={24}>
                <Statistic loading={isLoading} title="考勤得分" value={studentMsg?.daily_score || 0}/>
              </Col>
              <Col xl={6} lg={12} md={24}>
                <Statistic loading={isLoading} title="讲评得分" value={studentMsg?.review_score || 0}/>
              </Col>
              <Col xl={6} lg={12} md={24}>
                <Statistic loading={isLoading} title="期中测试" value={studentMsg?.middle_score || 0}/>
              </Col>
              <Col xl={6} lg={12} md={24}>
                <Statistic loading={isLoading} title="期末测试"
                           value={setting?.show_examination ? studentMsg?.examination_score || 0 : '**'}/>
              </Col>
            </Row>
          </Card>
          <Card
            title={"作业分数"}
            loading={isLoading}
            hoverable
            onClick={() => {
              setShowModal(true)
            }}
          >
            <LineComposition average={average?.assignments} studentInfo={studentMsg?.assignments}
                             config={{height: 300, autoFit: false}}/>
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} xs={24} span={6}>
          <Card
            title="分数组成"
            hoverable
            loading={isLoading}
          >
            <PieComposition
              settings={setting}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="作业分数"
        centered
        open={showModal}
        onCancel={() => {
          setShowModal(false)
        }}
        width={1000}
        height={800}
        footer={null}
      >
        <LineComposition average={average?.assignments} studentInfo={studentMsg?.assignments}
                         config={{height: 200, autoFit: false}}/>
        <Statistic title="平均分" value={studentMsg?.assignments_score}
                   style={{paddingLeft: '10px', margin: '10px 0'}}/>
        <AssignmentsTable
          studentInfo={studentMsg?.assignments}
          average={average?.assignments}
        />
      </Modal>
    </PageContainer>
  )
}

export default Dashboard;
