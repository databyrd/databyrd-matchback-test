import React from "react";
import { Card, CardBody, Button, Modal, ModalBody } from "reactstrap";
import * as node from "./service/nodeService";
import Swal from "sweetalert2";
// import { CSVDownload } from "react-csv";
import { CSVDownload } from "./custom_modules/react-csv";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import uploadFilled from "./images/databyrd_Upload_Rollover-01.png";
import uploadLayover from "./images/databyrd_Upload-01.png";
import lastStepImage1 from "./images/databyrd_RunReport-01.png";
import lastStepImage2 from "./images/databyrd_RunReport_Rollover-01.png";
import "./buttonCss.css";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#F6AA2E",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#F6AA2E",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 6,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className, activeStep } = props;
  return (
    <QontoStepIconRoot
      ownerState={{ active }}
      activeStep={activeStep}
      className={className}
    >
      {completed ? (
        <Check className='QontoStepIcon-completedIcon' />
      ) : (
        <div className='QontoStepIcon-circle' />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 37,
    paddingLeft: 60,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 80%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 80%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    width: 350,

    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[600] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  // backgroundColor:
  //   theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  // zIndex: 1,
  // color: "#fff",
  // width: 50,
  // height: 50,
  // display: "flex",
  // borderRadius: "50%",
  // justifyContent: "center",
  // alignItems: "center",
  // ...(ownerState.active && {
  //   backgroundImage:
  //     "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  //   boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  // }),
  // ...(ownerState.completed && {
  //   backgroundImage:
  //     "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  // }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    // 1: <UploadFileIcon style={{ fontSize: "50px" }} />,
    1: (
      <img
        alt='ImageUploaderStep1'
        style={{ height: "75px" }}
        src={uploadFilled}
      />
    ),
    // 2: <UploadFileIcon style={{ fontSize: "50px" }} />,
    2:
      props.active === true || props.completed === true ? (
        <img
          alt='ImageUploaderStep2'
          style={{ height: "75px" }}
          src={uploadFilled}
        />
      ) : (
        <img
          alt="'ImageUploaderBlank"
          style={{ height: "75px" }}
          src={uploadLayover}
        />
      ),
    3:
      props.active === true ? (
        <img
          alt='ImageUploaderStep3'
          style={{ height: "75px" }}
          src={lastStepImage2}
        />
      ) : (
        <img
          alt="'ImageUploaderBlank"
          style={{ height: "75px" }}
          src={lastStepImage1}
        />
      ),
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["Upload Sold List", "Upload Targeted List", "Run Matchback"];

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalFilePath: "",
      comparedFilePath: "",
      activeStep: 0,
      uploadList: [],
      compareList: [],
      uploadDetails: "",
      compareDetails: "",
      uploadingFile: false,
      originalDataId: "",
      comparedDataId: "",
      matchComplete: false,
      matchData: [],
      matchDataHeaders: [],
      soldListFile: null,
      postalListFile: null,
      largeFileDetected: false,
      matchQueue: false,
    };
    this.uploadListRef = React.createRef(null);
    this.uploadCompareRef = React.createRef(null);
    this.handleFileListUpload = this.handleFileListUpload.bind(this);
  }

  componentDidMount() {
    if (window.localStorage.getItem("matchQueId") !== null) {
      this.setState({ matchQueue: true });
    }
  }

  errorHandler = (err) => {
    this.setState({ uploadingFile: false });
    Swal.fire({
      icon: "error",
      title:
        "There was an issue uploading your file. Please make sure at least 1 column is labeled: Address",
    });
  };

  handleListRefClick = () => {
    this.uploadListRef.current.click();
  };

  handleCompareRefClick = () => {
    this.uploadCompareRef.current.click();
  };

  handleFileListUpload = (e) => {
    this.setState({ uploadingFile: !this.state.uploadingFile });
    const files = e.target.files;
    this.setState({ soldListFile: files[0] });
    const formData = new FormData();
    formData.append("file", files[0]);
    node.originalData(formData).then((res) => {
      this.setState({
        originalFilePath: res.path,
        uploadingFile: !this.state.uploadingFile,
        uploadDetails: files[0].name,
        activeStep: 1,
      });
      Swal.fire({
        icon: "success",
        title: `${files[0].name} has been uploaded`,
      });
    });
  };

  handleCompareFile = (e) => {
    this.setState({ uploadingFile: !this.state.uploadingFile });
    const files = e.target.files;
    this.setState({ postalListFile: files[0] });
    const formData = new FormData();
    formData.append("file", files[0]);
    node.compareData(formData).then((res) => {
      this.setState({
        comparedFilePath: res.path,
        uploadingFile: !this.state.uploadingFile,
        compareDetails: files[0].name,
        activeStep: 2,
      });
      Swal.fire({
        icon: "success",
        title: `${files[0].name} has been uploaded`,
      });
    });
  };

  handleNextStep = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handlePreviousStep = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  createMatchbackList = () => {
    this.setState({ uploadingFile: true });
    if (
      this.state.soldListFile.size > 850000 ||
      this.state.postalListFile.size > 850000
    ) {
      this.setState({ uploadingFile: false });
      Swal.fire({
        title: "Large Files Detected",
        text: "Large files may take longer to process, would you like to continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, find matches!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.setState({ uploadingFile: true, largeFileDetected: true });
          node
            .compareLargeFiles(
              this.state.originalFilePath,
              this.state.comparedFilePath
            )
            .then((res) => {
              window.localStorage.setItem("matchQueId", res);
              Swal.fire({
                icon: "success",
                title:
                  "Your files have been added to the queue, please check back in a few seconds to download your file",
              });

              this.setState({
                matchQueue: true,
                uploadingFile: false,
              });
            })

            .catch((err) => this.errorHandler(err));
        }
      });
    } else {
      node
        .compareSmallFiles(
          this.state.originalFilePath,
          this.state.comparedFilePath
        )
        .then((res) => {
          const matchedArray = this.sortData(res);

          Swal.fire({ icon: "success", title: "Match-Back Template complete" });

          this.setState({
            matchData: matchedArray,
            matchComplete: true,
          });
        })

        .catch((err) => this.errorHandler(err));
    }
  };

  sortData = (data) => {
    const matchBackData = data.comparedData;
    let listData = data.originalData;
    let matchBackArray = [];
    let matchesFound = 0;

    matchBackData.forEach((matchBackRow) => {
      for (let i = 0; i < listData.length; i++) {
        try {
          if (listData[i].SoldDateUTC) {
            const date = new Date(listData[i].SoldDateUTC);
            listData[i].SoldDateUTC = date.toString();
          }
          if (listData[i]["Address 1: Street 1"] && matchBackRow.Address) {
            let matchBackLower = matchBackRow.Address.toLowerCase();
            let listDataLower =
              listData[i]["Address 1: Street 1"].toLowerCase();

            if (matchBackLower === listDataLower) {
              matchBackArray.push(listData[i]);
            }
          } else if (listData[i].address) {
            let matchLower = matchBackRow.Address.toLowerCase();
            let listLower = listData[i].address.toLowerCase();
            if (matchLower === listLower) {
              matchBackArray.push(listData[i]);
            }
          } else if (
            listData[i].Address &&
            listData[i].Address.toLowerCase() ===
              matchBackRow.Address.toLowerCase()
          ) {
            matchesFound += 1;
            this.setState({ matchesFound });
            matchBackArray.push(listData[i]);
          } else if (listData[i]["Address 1"] && matchBackRow.Address) {
            let matchLower = matchBackRow.Address.toLowerCase();
            let listLower = listData[i]["Address 1"].toLowerCase();

            if (matchLower === listLower) {
              matchBackArray.push(listData[i]);
            }
          } else if (listData[i]["Street 1 (Regarding) (Lead)"]) {
            let matchLower = matchBackRow.Address.toLowerCase();
            let listLower =
              listData[i]["Street 1 (Regarding) (Lead)"].toLowerCase();

            if (matchLower === listLower) {
              matchBackArray.push(listData[i]);
            }
          } else {
            continue;
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

    this.setState({
      matchData: matchBackArray,
      matchComplete: true,
      uploadingFile: !this.state.uploadingFile,
    });

    this.removeFilesFromDB();

    return matchBackArray;
  };

  removeFilesFromDB = () => {
    node
      .deleteBothFiles(this.state.originalFilePath, this.state.comparedFilePath)
      .then(() => {
        this.setState({
          originalDataId: "",
          uploadDetails: "",
          comparedDataId: "",
          compareDetails: "",
          activeStep: 0,
          originalFilePath: "",
          comparedFilePath: "",
          matchData: [],
          matchComplete: false,
          largeFileDetected: false,
          matchQueue:false
        });
      });
  };

  handleOriginalFileRemove = () => {
    document.getElementById("originalFile").value = null;
    node.deleteOriginalFile(this.state.originalFilePath);
    this.setState({ originalFilePath: "", uploadDetails: "" });
  };

  handleCompareFileRemove = () => {
    document.getElementById("compareFile").value = null;
    node.deleteComparedFile(this.state.comparedDataId);
    this.setState({ comparedFilePath: "", compareDetails: "" });
  };

  checkQueue = () => {
    node
      .checkQueue(window.localStorage.getItem("matchQueId"))
      .then((res) => {
        if (res.returnvalue) {
          let finalResult = [];
          for (let i = 0; i < res.returnvalue.length; i++) {
            for (let j = 0; j < res.returnvalue[i].length; j++) {
              finalResult.push(res.returnvalue[i][j]);
            }
          }
          console.log(finalResult);
          this.setState({ matchData: finalResult, matchComplete: true });
          this.removeFilesFromDB();
          window.localStorage.clear()
        } else {
          Swal.fire({
            icon: "info",
            title: "File not ready yet please try again",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "File not found, please start over",
        });
      });
  };
  render() {
    return (
      <React.Fragment>
        <div className='px-0 py-0'>
          <div className='text-center'></div>

          <Modal size='sm' centered isOpen={this.state.uploadingFile}>
            <ModalBody centered className='text-center'>
              <div className='text-center'>
                {this.state.largeFileDetected === false &&
                (this.state.activeStep === 0 || this.state.activeStep === 1) ? (
                  <h2>Uploading File</h2>
                ) : null}
                {this.state.largeFileDetected === false &&
                this.state.activeStep === 2 ? (
                  <h2>Finding Matches</h2>
                ) : null}
                {this.state.largeFileDetected === true &&
                this.state.activeStep === 2 ? (
                  <h2>Searching for results...</h2>
                ) : null}
                <img
                  alt='searching'
                  src={
                    "https://databyrd-landing.s3.amazonaws.com/databyrd_searching.gif"
                  }
                />
                {/* <Oval color='#00BFFF' height={200} width={350} /> */}
              </div>
            </ModalBody>
          </Modal>

          <Card>
            <div className='text-center pt-5'>
              {" "}
              <h6
                style={{
                  fontFamily: "Roboto, sans-serif",
                  letterSpacing: "-0.008333333em",
                  fontWeight: 300,
                }}
              >
                ** Please disable popup blockers in order to download the new
                file **
              </h6>
            </div>

            <CardBody>
              <Stack sx={{ width: "100%" }} spacing={4}>
                <Stepper
                  alternativeLabel
                  activeStep={this.state.activeStep}
                  connector={<ColorlibConnector />}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Stack>

              <div className='col-12  text-center'>
                <div>
                  {this.state.uploadDetails ? (
                    <div
                      style={{
                        border: "1px solid black",
                        height: "100px",
                        padding: "10px",
                        justifyItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          paddingTop: "20px",
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        {this.state.uploadDetails}
                        {""}{" "}
                        <Button
                          onClick={() => this.handleOriginalFileRemove()}
                          className='btn-warning'
                        >
                          Delete
                        </Button>
                      </h3>
                    </div>
                  ) : null}

                  <br />
                  {this.state.compareDetails ? (
                    <div
                      style={{
                        border: "1px solid black",
                        height: "100px",
                        padding: "10px",
                        justifyItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          paddingTop: "20px",
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        {this.state.compareDetails} {""}{" "}
                        {this.state.compareDetails ? (
                          <Button
                            onClick={() => this.handleCompareFileRemove()}
                            className='btn-warning'
                          >
                            Delete
                          </Button>
                        ) : null}
                      </h3>
                    </div>
                  ) : null}
                </div>
                <br />
                {this.state.activeStep === 0 ? (
                  <div>
                    <Button
                      onClick={this.handleListRefClick}
                      className='col-2 mt-5'
                      id='uploadButton'
                      // style={{
                      //   backgroundColor: "#f9ac2f",
                      //   fontFamily: "Roboto, sans-serif",
                      //   fontWeight: 300,
                      //   letterSpacing: "-0.008333333em",
                      // }}
                    >
                      Upload List
                    </Button>
                  </div>
                ) : null}

                {this.state.activeStep === 1 ? (
                  <div>
                    {/* <h6 style={{ color: "red" }}>
                    ** Upload your postal list or list to compare to. **
                  </h6> */}
                    <Button
                      onClick={this.handleCompareRefClick}
                      className='col-2 mt-5'
                      id='uploadButton'
                      // style={{
                      //   fontFamily: "Roboto, sans-serif",
                      //   letterSpacing: "-0.008333333em",
                      //   fontWeight: 300,
                      //   backgroundColor: "#f9ac2f",
                      // }}
                    >
                      Upload Targeted List
                    </Button>
                  </div>
                ) : null}

                {this.state.activeStep === 2 ? (
                  <div>
                    <Button
                      onClick={() => this.createMatchbackList()}
                      className='col-2 mt-5'
                      id='uploadButton'
                      // style={{
                      //   fontFamily: "Roboto, sans-serif",
                      //   letterSpacing: "-0.008333333em",
                      //   fontWeight: 300,
                      //   backgroundColor: "#f9ac2f",
                      // }}
                    >
                      Create Matchback List
                    </Button>
                    {this.state.matchComplete ? (
                      <CSVDownload
                        filename={"MatchBack-Results.csv"}
                        data={this.state.matchData}
                      />
                    ) : null}
                  </div>
                ) : null}
                {this.state.matchQueue === true ? (
                  <Button
                    onClick={this.checkQueue}
                    className='col-2 mt-5'
                    id='uploadButton'
                    // style={{
                    //   backgroundColor: "#f9ac2f",
                    //   fontFamily: "Roboto, sans-serif",
                    //   fontWeight: 300,
                    //   letterSpacing: "-0.008333333em",
                    // }}
                  >
                    Check Queue
                  </Button>
                ) : (
                  false
                )}
              </div>
            </CardBody>
            {this.state.activeStep === 0 ? (
              <input
                style={{ display: "none" }}
                // accept=".zip,.rar"
                ref={this.uploadListRef}
                onChange={this.handleFileListUpload}
                type='file'
                id='originalFile'
              />
            ) : null}
            {this.state.activeStep === 1 ? (
              <input
                style={{ display: "none" }}
                // accept=".zip,.rar"
                ref={this.uploadCompareRef}
                onChange={this.handleCompareFile}
                type='file'
                id='compareFile'
              />
            ) : null}

            <div style={{ paddingTop: 95 }} className='col-12 row text-center'>
              <div className='col-6'>
                <Button
                  disabled={this.state.activeStep === 0}
                  onClick={this.handlePreviousStep}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 300,
                    letterSpacing: "-0.008333333em",
                    backgroundColor: "#5F4B89",
                  }}
                >
                  Back
                </Button>
              </div>
              <div className='col-6'>
                {" "}
                <Button
                  disabled={this.state.activeStep === 2}
                  onClick={this.handleNextStep}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 300,
                    letterSpacing: "-0.008333333em",
                    backgroundColor: "#5F4B89",
                  }}
                >
                  Next
                </Button>{" "}
              </div>
            </div>
            <div className='col-12'></div>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default Uploader;
