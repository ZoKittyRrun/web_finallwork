import { DatePicker, Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const { RangePicker } = DatePicker;

const AddPlanModal = ({ visible, onCancel, onOk }) => {
  const [planName, setPlanName] = useState('');
  const [dateRange, setDateRange] = useState([]);

  const handleOk = () => {
    if (!planName || !dateRange || dateRange.length !== 2) {
      message.error('请输入计划名称并选择开始时间和结束时间');
      return;
    }
    // 调用父组件传入的 onOk 函数，并传递计划名称和日期范围作为参数
    onOk(planName, dateRange);
  };

  return (
    <Modal
      visible={visible}
      title="新增计划"
      onCancel={onCancel}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
    >
      <Input
        placeholder="请输入计划名称"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
      />
      <RangePicker
        style={{ marginTop: '12px' }}
        showTime
        format="YYYY-MM-DD HH:mm"
        onChange={(dates) => setDateRange(dates)}
      />
    </Modal>
  );
};

const showAddPlanModal = (): Promise<{ name: string; dates: [dayjs.Dayjs, dayjs.Dayjs] }> => {
  return new Promise((resolve, reject) => {
    let modalRef = null;

    const handleOk = (name: string, dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
      modalRef.destroy();
      resolve({ name, dates }); // 将输入的计划名称和日期范围传递给 resolve
    };

    const handleCancel = () => {
      modalRef.destroy();
      reject(); // 如果取消了输入，直接 reject
    };

    modalRef = Modal.info({
      title: '新增计划',
      content: <AddPlanModal visible={true} onCancel={handleCancel} onOk={handleOk} />,
      okButtonProps: { style: { display: 'none' } }, // 隐藏确认按钮
      cancelButtonProps: { style: { display: 'none' } }, // 隐藏取消按钮
    });
  });
};

export default showAddPlanModal;
