// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, Button } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import axiosInstance from '../../../@core/api/axiosInstance'
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'
import moment from 'moment'
import { Paperclip } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import DataTable from 'react-data-table-component'
import Badge from 'reactstrap/lib/Badge'
const ToastContent = ({ type, content }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color={type} icon={<Paperclip size={12} />} />
                <h6 className='title ml-1 font-weight-bold'>{type}</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>{content}</span>
        </div>
    </>
)

const Report = () => {
    // ** Get data on mount

    const [dataRequest, setDataRequest] = useState('')
    const [datefrom, setDatefrom] = useState('')
    const [dateto, setDateto] = useState('')
    const [DemmandResult, SetDemmandResult] = useState([])
    const userData = JSON.parse(localStorage.getItem('userData'))
    const Getreportdata = () => {

        if (datefrom !== '' && dateto !== '') {
            axiosInstance.get(`getreport/${datefrom}/${dateto}/${userData.hotel_id}`).then(res => {
                SetDemmandResult(res.data)
                setDataRequest(res.data)
                toast.success(
                    <ToastContent type='success' content="Report has been generated successfully !" />,
                    { transition: Slide, hideProgressBar: true, autoClose: 3000 }
                )

            })
        } else {
            toast.warn(
                <ToastContent type='warning' content="Select Date Please !" />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
        }


    }

    const Downloadpdf = () => {


        const unit = "pt"
        const size = "A4" // Use A1, A2, A3 or A4
        const orientation = "portrait" // portrait or landscape
        const options = { year: 'numeric', month: 'long', day: 'numeric', hours: 'numeric' }
        const marginLeft = 40
        const doc = new jsPDF(orientation, unit, size)
        const hours = 'h '
        const minutes = 'm'

        doc.setFontSize(15)

        const title = "Clients Request Report"
        const headers = [["Name", "Option", "Message", "Room", "Sent date", "Done By", "apply at", "apply time"]]

        const data = DemmandResult.map(item => [
            item.demmand.name,
            item.option ? item.option.name : 'no option',
            item.message,
            item.room.room_number,
            (moment(item.created_at).format('DD-MM-YYYY / HH:MM:SS')),
            item.done_by ? item.done_by.name : "pending",
            (moment(item.updated_at).format('DD-MM-YYYY / HH:MM:SS')),
            ((item.updated_at === item.created_at) ? "pending" : moment.duration(moment(item.updated_at).diff(moment(item.created_at))).get('h')
                + hours + moment.duration(moment(item.updated_at).diff(moment(item.created_at))).get('m') + minutes)
        ])

        const content = {
            startY: 50,
            head: headers,
            body: data
        }
        doc.text(title, marginLeft, 40)
        doc.autoTable(content)
        doc.save("Clients Request Report.pdf")

    }


    const columnsRequest = [
        {
            name: 'Title',
            minWidth: '297px',
            selector: 'name',
            sortable: true,
            cell: row => (
                <div className='d-flex justify-content-left align-items-center'>
                    <Avatar className='mr-1' img={row.demmand.icon} width='32' height='32' />
                    <div className='d-flex flex-column'>
                        <span className='font-weight-bold'>{row.demmand.name}</span>
                    </div>
                </div>
            )
        },
        {
            name: 'Message',
            selector: 'message',
            sortable: true,
            cell: row => (
                <span className='font-weight-bold' >{`${row.message}`}</span>
            )
        },
        {
            name: 'Room',
            selector: 'room',
            sortable: true,
            cell: row => (
                <span className='font-weight-bold' >{row.room.room_number}</span>
            )
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: true,
            cell: row => (
                <Badge color={`light-${row.status === "pending" ? "warning" : "success"}`}>{row.status}</Badge>
            )
        }

    ]

    return (
        <Fragment>
            <Card>
                <h1 style={{ paddingLeft: '15px', paddingTop: '15px' }}>Clients Requests Report</h1>
                <CardBody>
                    <div className='row mb-3'>
                        <div className='col-md-5'>
                            <p style={{ paddingTop: '9px' }}>Select Start Date :</p>
                            <input type="datetime-local"
                                onChange={(e) => { setDatefrom(e.target.value) }}
                                name="datefrom"
                                className='form-control  datefrom mr-2' />
                        </div>
                        <div className='col-md-5'>
                            <p style={{ paddingTop: '9px' }}>Select End Date :</p>
                            <input type="datetime-local"
                                onChange={(e) => { setDateto(e.target.value) }}
                                name="dateto"
                                className='form-control dateto mr-2'
                            />
                        </div>
                        <div className='col-md-2'>
                            <Button color='primary' onClick={Getreportdata} className="mt-3 col-md-12">
                                Generate Report
                            </Button>
                        </div>
                    </div>
                    <DataTable
                        noHeader
                        pagination
                        columns={columnsRequest}
                        className='react-dataTable'
                        data={dataRequest}
                    />

                    {
                        dataRequest === '' ? '' : (<Button color='primary' onClick={Downloadpdf} className="mr-2 mt-2">
                            Donwload Report
                        </Button>)
                    }
                </CardBody>


            </Card>

        </Fragment>
    )
}

export default Report
