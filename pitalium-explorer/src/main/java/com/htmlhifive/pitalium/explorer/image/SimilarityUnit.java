package com.htmlhifive.pitalium.explorer.image;

import java.awt.Rectangle;

/**
 * Similarity unit class contains information of the similarity calculated from each method.
 */
public class SimilarityUnit {
	
	private int XSimilar;
	private int YSimilar;
	private double similarityPixelByPixel;
	private double similarityFeatureMatrix;
	private double similarityThresDiff;
	private double similarityTotalDiff;
	
	/**
	 * Default constructor
	 */
	public SimilarityUnit(int XSimilar, int YSimilar, double similarityPixelByPixel, double similarityFeatureMatrix, double similarityThresDiff, double similarityTotalDiff) {
		this.XSimilar = XSimilar;
		this.YSimilar = YSimilar;
		this.similarityPixelByPixel = similarityPixelByPixel;
		this.similarityFeatureMatrix = similarityFeatureMatrix;
		this.similarityThresDiff = similarityThresDiff;
		this.similarityTotalDiff = similarityTotalDiff;
	}
	public SimilarityUnit(){
		this(0, 0, 0, 0, 0, 0);
	}


	/**
	 * @param XSimilar  X-direction shift at the best match with the highest similarity
	 * @param YSimilar  Y-direction shift at the best match with the highest similarity
	 * @param similarityPixelByPixel the highest similarity calculated using pixel by pixel mehtod at the position of given X, Y-Similar
	 */
/*	public setSimilarityPixelByPixel (int XSimilar, int YSimilar, double similarityPixelByPixel) {
		this.XSimilar = XSimilar;
		this.YSimilar = YSimilar;
		this.similarityPixelByPixel = similarityPixelByPixel;
	}
*/
	/**
	 * @param similarityThresDiff similarity counting difference from thresold
	 * @param similarityTotalDiff similarity counting difference from zero
 */
/*	public setSimilarityDiff (double similarityThresDiff, double similarityTotalDiff) {
		this.similarityThresDiff = similarityThresDiff;
		this.similarityTotalDiff = similarityTotalDiff;
	}
*/	
	/**
	 * @param similarityFeatureMatrix similarity calculated using feature matrix
 	 */
/*	public setSimilarityFeatureMatrix (double similarityFeatureMatrix) {
		this.similarityFeatureMatrix = similarityFeatureMatirx;
	}
*/
	/**
	 * @return X-direction Similar at the best match with the highest similarity
	 */
	public int getXSimilar() {
		return XSimilar;
	}
	public void setXSimilar(int XSimilar){
		this.XSimilar = XSimilar;
	}

	/**
	 * @return Y-direction Similar at the best match with the highest similarity
	 */
	public int getYSimilar() {
		return YSimilar;
	}
	public void setYSimilar(int YSimilar){
		this.YSimilar = YSimilar;
	}


	/**
	 * @return the highest similarity calculated using pixel by pixel mehtod at the position of given X, Y-Similar
	 */
	public double getSimilarityPixelByPixel() {
		return similarityPixelByPixel;
	}
	public void setSimilarityPixelByPixel(double similarityPixelByPixel){
		this.similarityPixelByPixel = similarityPixelByPixel;
	}

	/**
	 * @return similarity calculated using feature matrix
	 */
	public double getSimilarityFeatureMatrix() {
		return similarityFeatureMatrix;
	}
	public void setSimilarityFeatureMatrix(double similarityFeatureMatrix){
		this.similarityFeatureMatrix = similarityFeatureMatrix;
	}
	
	/**
	 * @return similarity counting difference from thresold
	 */
	public double getSimilarityThresDiff() {
		return similarityThresDiff;
	}
	public void setSimilarityThresDiff(double similarityThresDiff){
		this.similarityThresDiff = similarityThresDiff;
	}
	
	/**
	 * @return similarity counting difference from zero
	 */
	public double getSimilarityTotalDiff() {
		return similarityTotalDiff;
	}
	public void setSimilarityTotalDiff(double similarityTotalDiff){
		this.similarityTotalDiff = similarityTotalDiff;
	}
}
