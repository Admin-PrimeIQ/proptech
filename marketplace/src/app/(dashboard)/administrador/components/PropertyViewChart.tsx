"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to prevent SSR issues
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const PropertyViewChart = () => {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: true },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "40%",
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
            labels: { style: { colors: "#888", fontSize: "12px" } },
        },
        yaxis: {
            min: 0,
            max: 110,
            tickAmount: 11,
            labels: {
                style: { colors: "#888", fontSize: "12px" },
                formatter: (value: number) => value.toFixed(0),
            },
            axisTicks: { show: true },
        },
        fill: { opacity: 1, colors: ["#5758D6", "#DBD6FD"] },
        tooltip: {
            y: {
                formatter: (val: number) => `$ ${val} thousands`,
            },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    yaxis: {
                        tickAmount: 7,
                        labels: {
                            formatter: (value: number) =>
                                value % 20 === 0 ? value.toFixed(0) : "",
                        },
                    },
                },
            },
        ],
    };

    const series = [
        { name: "Clicked", data: [44, 55, 57, 56, 61, 58] },
        { name: "View", data: [76, 85, 101, 98, 87, 105] },
    ];

    return (
        <div className="tp-dashboard-chart-wrap">
            <h4 className="tp-dashboard-activity-title">Property Views</h4>
            <div style={{ height: "100%", minHeight: "300px" }}>
                <ApexCharts options={options} series={series} type="bar" height="100%" />
            </div>
        </div>
    );
};

export default PropertyViewChart;
