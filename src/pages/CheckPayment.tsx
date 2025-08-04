import { Result, Button } from 'antd';
import axios from 'axios';
import { title } from 'process';
import React, { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CheckPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState<"error" | "success">("error");
  const [title, setTitle] = React.useState("Thanh toán thất bại");
  useEffect(() => {
    const checkPayment = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/check_payment?${searchParams.toString()}`);
        if (data.data.vnp_ResponseCode === "00") {
          setStatus("success");
          setTitle("Thanh toán thành công");
        } else {
          setStatus("error");
          setTitle("Thanh toán thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkPayment();
  }, [searchParams]);



  return (
    <>
      <Result
        status={status}
        title={title}
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button type="primary" key="console">
            <Link to={'/'}>Quay lại trang chủ</Link>
          </Button>
        ]}
      />
    </>
  )
}

export default CheckPayment