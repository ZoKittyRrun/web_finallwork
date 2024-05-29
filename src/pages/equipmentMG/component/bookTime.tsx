import { DatePicker, message, Modal } from 'antd';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const { RangePicker } = DatePicker;

interface ReserveTimeModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (dates: [moment.Moment, moment.Moment]) => void;
}

const ReserveTimeModal: React.FC<ReserveTimeModalProps> = ({ visible, onCancel, onOk }) => {
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const handleOk = () => {
    if (!dateRange || dateRange.length !== 2) {
      message.error('请选择开始时间和结束时间');
      return;
    }
    onOk(dateRange);
  };

  return (
    <Modal
      visible={visible}
      title="选择预约时间"
      onCancel={onCancel}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
    >
      <RangePicker
        style={{ marginTop: '12px' }}
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment])}
      />
    </Modal>
  );
};

const bookTime = (): Promise<[moment.Moment, moment.Moment]> => {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const handleOk = (dates: [moment.Moment, moment.Moment]) => {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      resolve(dates);
    };

    const handleCancel = () => {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      reject();
    };

    ReactDOM.render(
      <ReserveTimeModal visible={true} onCancel={handleCancel} onOk={handleOk} />,
      div,
    );
  });
};

export default bookTime;
