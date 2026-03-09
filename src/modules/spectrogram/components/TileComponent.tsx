import { memo, useEffect, useRef } from "react";
import styles from "./AudioSpectrogram.module.css";

export interface TileComponentProps {
	tileId: string;
	left: number;
	width: number;
	height: number;
	canvasWidth: number;
	bitmap?: ImageBitmap;
}

export const TileComponent = memo(
	({
		tileId,
		left,
		width,
		height,
		canvasWidth,
		bitmap,
	}: TileComponentProps) => {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const currentBitmapRef = useRef<ImageBitmap | undefined>(undefined);

		useEffect(() => {
			if (bitmap !== currentBitmapRef.current) {
				// 先保存旧 bitmap 的引用
				const oldBitmap = currentBitmapRef.current;
				// 更新当前 bitmap 引用
				currentBitmapRef.current = bitmap;
				// 关闭旧的 bitmap
				if (oldBitmap) {
					try {
						oldBitmap.close();
					} catch {
						// 忽略已关闭的 bitmap
					}
				}
			}

			if (bitmap && canvasRef.current) {
				const canvas = canvasRef.current;
				if (canvas.width !== bitmap.width) canvas.width = bitmap.width;
				if (canvas.height !== bitmap.height) canvas.height = bitmap.height;
				const ctx = canvas.getContext("2d");
				// 清除画布
				ctx?.clearRect(0, 0, canvas.width, canvas.height);
				// 检查 bitmap 是否有效
				try {
					ctx?.drawImage(bitmap, 0, 0);
				} catch (e) {
					// 如果 bitmap 无效，忽略绘制错误
					console.warn("Failed to draw bitmap:", e);
				}
			}
		}, [bitmap]);

		// 清理函数
		useEffect(() => {
			return () => {
				if (currentBitmapRef.current) {
					try {
						currentBitmapRef.current.close();
					} catch {
						// 忽略已关闭的 bitmap
					}
					currentBitmapRef.current = undefined;
				}
			};
		}, []);

		return (
			<canvas
				ref={canvasRef}
				id={tileId}
				width={canvasWidth > 0 ? canvasWidth : 1}
				height={height}
				className={styles.tileCanvas}
				style={{
					left: `${left}px`,
					width: `${width}px`,
					backgroundColor: bitmap ? "transparent" : "var(--gray-3)",
				}}
			/>
		);
	},
);
