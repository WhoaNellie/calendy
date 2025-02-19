import React, { useContext, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import logo from "../assets/logo.png";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Link, useHistory } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { Button } from "@material-ui/core";
import { emailExists } from "../utils/googleAuth";
import axios from "axios";

import { useSetAuthenticated, UserContext } from "../providers/Context";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  formMain: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10%",
    fontFamily: theme.typography.fontFamily,
  },
  footer: {
    fontFamily: theme.typography.fontFamily,
    padding: "5%",
    textAlign: "center",
  },
  logo: {
    marginTop: "10vh",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "5vh",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    background: theme.palette.primary.button,
    color: "white",
    padding: "15px 50px 15px 50px",
    width: "12em",
    margin: "1em",
  },
  link: {
    marginLeft: 3,
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  paper: {
    width: "80%",
    margin: "auto",
    position: "relative",
  },
  formInput: {
    marginTop: "20%",
    width: "90%",
  },
  formLabel: {
    marginBottom: "-10px",
    textAlign: "center",
  },
}));

const LogInPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState(null);
  //welcomeMsg is true if use has entered an email and pressed continue button
  const [welcomeMsg, showWelcome] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const history = useHistory();
  const setAuthenticated = useSetAuthenticated();
  const { setIsDemo } = useContext(UserContext);

  const handleClick = async (event) => {
    event.preventDefault();
    //cehck if user has entered an email

    if (email) {
      const emailExist = await emailExists(email);
      if (!emailExist) {
        setEmailError(true);
        return;
      }

      showWelcome(true);
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const _registerDemoAccount = () => {
    const email = "demo" + Date.now() + "@mail.com";
    const password = Date.now().toString();
    const name = "demo user" + Date.now();
    axios
      .post("/api/authentication/sign-up", { email, password, name })
      .then(() => {
        setAuthenticated(true);
        history.push("/onboarding");
      });
  };

  const demoNoAuth = () => {
    setIsDemo(true);
    history.push("/onboarding");
  };

  return (
    <Container
      maxWidth="sm"
      classes={{
        root: classes.root,
      }}
    >
      <img src={logo} alt="company logo" className={classes.logo} />
      <Paper elevation={5} className={classes.paper}>
        <form className={classes.formMain} onSubmit={handleClick}>
          <Typography variant="h5">
            {welcomeMsg ? (
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <span>{`Welcome back,`}</span>
                <span>{email}</span>
              </span>
            ) : (
              `Log into your account`
            )}
          </Typography>
          {welcomeMsg ? null : (
            <div className={classes.formInput}>
              <Typography variant="h6" className={classes.formLabel}>
                Enter your E-mail to get started:
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                placeholder="E-mail address"
                autoFocus
                style={{ textAlign: "center" }}
                inputProps={{ min: 0, style: { textAlign: "center" } }}
                onChange={handleChange}
                error={emailError}
                helperText={
                  emailError ? `No account exists for ${email}` : null
                }
              />
            </div>
          )}
          {welcomeMsg ? (
            <GoogleLoginButton variant={"login"} />
          ) : (
            <>
              <Button className={classes.button} type="submit">
                Continue
              </Button>
              <Button
                variant="outlined"
                color="primary"
                type="button"
                onClick={() => {
                  demoNoAuth();
                }}
              >
                Want a demo tour?
              </Button>
            </>
          )}
        </form>
        <Divider />
        <div className={classes.footer}>
          <Typography variant="h6">
            {`Don't have an account?`}
            <Link className={classes.link} to="signup">
              Sign up
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default LogInPage;
