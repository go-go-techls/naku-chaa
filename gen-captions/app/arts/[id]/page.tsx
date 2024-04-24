"use client";
import { DataItem } from "@/app/api/results/route";
import { getArt } from "@/lib/getArts";
import { useEffect, useState } from "react";
import { Box, Grid, IconButton } from "@mui/material";
import ArtworkDisplay from "../../components/ArtworkDisplay";
import ArtworkDetails from "../../components/ArtworkDetails";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArtworkTitle from "../../components/ArtworkTitle";
import RefreshTitle from "../../components/RefreshTitle";
import Link from "next/link";

export default function Arts({ params }: { params: { id: string } }) {
  const [data, setData] = useState<DataItem>({} as DataItem);

  useEffect(() => {
    getArt(params.id, setData);
  }, [params.id]); // IDが変わるたびにAPIが呼び出される

  function doNothing() {}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Link href="/list" passHref>
        <IconButton
          aria-label="戻る"
          size="large"
          sx={{ position: "fixed", top: "1rem", left: "1rem" }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      </Link>

      <Grid
        container
        // style={{ height: "100vh", width: "100vw"}}
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={7}
          container
          style={{ height: "100vh", width: "100vw" }}
        >
          <ArtworkDisplay imageBase64={data.image} />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          container
          style={{ height: "100vh", width: "100vw" }}
        >
          <Box
            sx={{ p: 4, mt: 4 }}
            style={{ maxHeight: "100vh", overflow: "auto" }}
          >
            <ArtworkTitle title={data.title}>
              <RefreshTitle imageBase64={data.image} setTitle={() => {}} />
            </ArtworkTitle>
            <ArtworkDetails
              title={data.title}
              feature={data.feature}
              advantage={data.advantage}
              advice={data.advice}
              image={data.image}
              disable={true}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>

    // <div>
    //       <h1>My Post: {params.id}</h1>
    //       <Paper
    //         elevation={3}
    //         sx={{
    //           width: "32.4vw", // ビューポートの1/3の幅
    //           height: "32.4vw", // ビューポートの1/3の高さ
    //           backgroundImage: `url(${data.image})`,
    //           backgroundSize: "cover",
    //           backgroundPosition: "center",
    //           overflow: "hidden",
    //         }}
    //       />
    //     </div>
  );
}
