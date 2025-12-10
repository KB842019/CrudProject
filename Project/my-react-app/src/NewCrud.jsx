import React, { useEffect, useState } from "react";
import { Button, Grid, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";

const STORAGE_KEY = "newCrudData";

export default function NewCrud() {
  const [myData, setMyData] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "" },
  });
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMyData(parsed);
        }
      } catch (error) {
        console.error("LocalStorage read error:", error);
      }
    };

    loadData();
  }, []);

  const onSubmit = (data) => {
    const updated = [...myData, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setMyData(updated);
    reset();
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Grid item xs={12} sm={8} md={5} lg={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            sx={{
              color: "red",
              fontWeight: "bold",
              fontSize: "20px",
              textAlign: "center",
              mb: 2,
            }}
          >
            Simple CRUD with LocalStorage
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enter name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                  })}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ px: "50px", py: "10px" }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography sx={{ mt: 3, fontSize: "18px", fontWeight: "bold" }}>
            Saved Users:
          </Typography>

          {myData.length === 0 ? (
            <Typography>No data found</Typography>
          ) : (
            myData.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mt: 1,
                  background: "#fafafa",
                  borderLeft: "5px solid #1976d2",
                }}
              >
                <Typography>
                  <b>Name:</b> {item.name}
                </Typography>
                <Typography>
                  <b>Email:</b> {item.email}
                </Typography>
              </Paper>
            ))
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
