import { reducer, StateType } from "./Reducer";
import { useReducer, useState, useEffect } from "react";
import { Button, Input, Table, Drawer, Form, Select } from "antd";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const User = () => {
  const [state, dispatch] = useReducer(reducer, []);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<StateType[0] | null>(null);
  const [form] = Form.useForm();

  const apiBase = "https://dd68f8476d3179e5.mokky.dev/users";

  useEffect(() => {
    const res = async () => {
      try {
        const response = await axios.get(apiBase);
        dispatch({ type: "set", payload: response.data });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    res();
  }, []);

  const openDrawer = (record?: StateType[0]) => {
    setEditRecord(record || null);
    form.setFieldsValue(record || {});
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditRecord(null);
    form.resetFields();
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      if (editRecord) {
        await axios.patch(`${apiBase}/${editRecord.id}`, values);
        dispatch({
          type: "edit",
          payload: { id: editRecord.id, updates: values },
        });
      } else {
        const response = await axios.post(apiBase, values);
        dispatch({ type: "add", payload: response.data });
      }
      closeDrawer();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiBase}/${id}`);
      dispatch({ type: "delete", payload: { id } });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Actions",
      key: "actions",
      render: (record: StateType[0]) => (
        <>
          <Button type="link" onClick={() => openDrawer(record)}>
            <FaRegEdit />
          </Button>
          <Button type="link" danger onClick={() => deleteUser(record.id)}>
            <RiDeleteBin6Line />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center py-2 px-3">
        <div>
          <h2>User Management</h2>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => openDrawer()}
            style={{ marginBottom: 16 }}
          >
            Add User
          </Button>
        </div>
      </div>
      <Table dataSource={state} columns={columns} rowKey="id" />
      <Drawer
        title={editRecord ? "Edit User" : "Add User"}
        open={drawerVisible}
        onClose={closeDrawer}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <Input type="number" placeholder="Age" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please enter country" }]}
          >
            <Select placeholder="Select country">
              <Select.Option value="UZB">Uzbekistan</Select.Option>
              <Select.Option value="USA">USA</Select.Option>
              <Select.Option value="UK">UK</Select.Option>
              <Select.Option value="Canada">Canada</Select.Option>
              <Select.Option value="Australia">Australia</Select.Option>
              <Select.Option value="Germany">Germany</Select.Option>
              <Select.Option value="France">France</Select.Option>
              <Select.Option value="Japan">Japan</Select.Option>
              <Select.Option value="China">China</Select.Option>
              <Select.Option value="India">India</Select.Option>
              <Select.Option value="Brazil">Brazil</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editRecord ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default User;
