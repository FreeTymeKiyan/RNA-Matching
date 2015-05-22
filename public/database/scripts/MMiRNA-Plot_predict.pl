#!/usr/bin/perl

use strict;
use warnings;

use  Excel::Writer::XLSX;

############## Yongsheng Bai (All rights reserved) ##############################################
# correlation calculation method was adopted from http://davetang.org/muse/2010/11/29/calculating-pearson-correlation-using-perl/
# Command line:
#perl MMiRNA-Plot_predict_path_complete.pl All_miRNA.txt FGFR3_mRNA.txt Targetprofiler_full.txt targetscan_60_output_Redo.txt.preprocess.out.txt v5.txt.homo_sapiens.hsa.miRanda.txt 10 2 /net/home/ybai/test1/test_prediction/prediction_path
#################################################################################################

my ($inputfile7, $inputfile6, $inputfile3, $inputfile2, $inputfile1, $toplist, $predictednum, $predictionpath) = @ARGV;

`mkdir $predictionpath`;
my $workbook = Excel::Writer::XLSX->new("$predictionpath/Plot_chart_y2Axis.xlsx");


my $vector = [];

my %miRNA7;
my %mRNA6;
my %gene_miRNA;
my %gene_mRNA;
my %gene_finalmiRNA;
my %gene;
my %gene3;
my %gene2;
my %gene1;
my %gene0;

my $TRUE = 1;
my $FALSE = -1;
my $flag_targetprofiler;
my $flag_targetscan;
my $flag_miRanda;

my $sheetCounter = 1;

my $counter;

my @column_header;
my $sampleSize;

#miRNA data
open INFILE7, "$inputfile7";
while(my $line7 = <INFILE7>)
{
  chomp($line7);
  my @array_line7 = split(/\t/, $line7);
  $sampleSize = $#array_line7;
  if($line7 =~ m/^#/)
  {
    for(my $i=0; $i < $sampleSize; $i++)
    {
      $column_header[$i] = $array_line7[$i + 1];
    }
    next;
  }
  else
  {
    #hash miRNA table here: Key: miRNA_ID; Value: array of miRNA_ID and normalized count values
    $miRNA7{$array_line7[0]} = [@array_line7];
  }
}
close INFILE7;

#mRNA data
open INFILE6, "$inputfile6";
while(my $line6 = <INFILE6>)
{
    chop($line6);
    #$line =~ s/\r$//;
    if($line6 =~ m/^#/)
    {
      next;
    }
    else
    {
      my @array_geneline6 = split(/\t/, $line6);
      #$mRNA6{$array_geneline6[0]} = [@array_geneline6];
      #specifically for TCGA data set
      my @array_geneline7 = split(/\|/, $array_geneline6[0]);
      $mRNA6{$array_geneline7[0]} = [@array_geneline6];
    }
}
close(INFILE6);

my $outfile7 = "output.txt";
open OUTFILE7, ">$predictionpath/$outfile7";
foreach my $keymRNA6 (keys %mRNA6)
{
   foreach my $keymiRNA7 (keys %miRNA7)
   {
     for(my $j=0; $j<$sampleSize; $j++)
     {
       $vector->[$j + 1][1] = $mRNA6{$keymRNA6}[$j + 1];
       $vector->[$j + 1][2] = $miRNA7{$keymiRNA7}[$j + 1];
     }

     my $correlation = correlation($vector);
     print OUTFILE7 $keymRNA6, "\t", $keymiRNA7, "\t", "$correlation\n";
      
   }
}
close(OUTFILE7);

my $outfile7_sorted = `sort -k3 -n $predictionpath/$outfile7 > $predictionpath/sorted.$outfile7`;
my $outfile7_sorted_subset = `head -$toplist $predictionpath/sorted.$outfile7 > $predictionpath/sorted.$toplist.$outfile7`;
 

#TargetProfiler
open INFILE3, "$inputfile3";
while(my $line3 = <INFILE3>)
{
  chomp($line3);
  my @array_line3 = split(/\t/, $line3);
  #mirID and GeneName
  $gene3{$array_line3[2]."+".$array_line3[1]} = $line3;
}
close INFILE3;

#TargetScan
open INFILE2, "$inputfile2";
while(my $line2 = <INFILE2>)
{
  chomp($line2);
  my @array_line2 = split(/\t/, $line2);
  #mirID and GeneName
  $gene2{$array_line2[0]."+".$array_line2[1]} = $line2;
}
close INFILE2;

#miRANDA
open INFILE1, "$inputfile1";
while(my $line1 = <INFILE1>)
{
  chomp($line1);
  my @array_line1 = split(/\t/, $line1);
  #hash refSeq table here: key: Mir-ID; Value: GeneSymbol
  if(scalar(@array_line1) > 12) #make sure that both miRNA and gene symbol available
  {
    $gene1{$array_line1[1]."+".$array_line1[12]} = $line1;
  }
}
close INFILE1;

open INFILE0, "$predictionpath/sorted.$toplist.$outfile7";
while (my $line0 = <INFILE0>)
{
  chomp($line0);
  my @array_line0 = split(/\t/, $line0);
  #miRNA + gene
  $gene0{$array_line0[1]."+".$array_line0[0]} = $line0;
  $gene{$array_line0[1]."+".$array_line0[0]} = [@array_line0];
}
close INFILE0;

open OUTFILE, ">$predictionpath/sorted.$toplist.table.expression.txt";
#loop through top 100 lists
foreach my $key0 (keys %gene0)
{
  my $gene_mRNA_string;
  $flag_targetprofiler = $FALSE;
  $flag_targetscan = $FALSE;;
  $flag_miRanda = $FALSE;

  my $predict_counter = 0;

  my @array_gene0 = split(/\+/, $key0);

  print OUTFILE $gene0{$key0}, "\t";

  foreach my $key3 (keys %gene3)
  {
    #my $subSeq3 = substr($array_gene0[0],0,-1);
    my @array_gene3 = split(/\+/, $key3);
    #miRNA similar match and gene match
    #if(($array_gene3[0] =~ m/$subSeq3/) && ($array_gene3[1] eq $array_gene0[1])) 
    if(($array_gene3[0] eq $array_gene0[0]) && ($array_gene3[1] eq $array_gene0[1]))
    {
      print OUTFILE "targetprofiler-Yes", "\t";
      $flag_targetprofiler = $TRUE; 
      $predict_counter++;
      last;     
    }
  }
  if($flag_targetprofiler == $FALSE)
  {
    print OUTFILE "targetprofiler-NO", "\t";
  }

  foreach my $key2 (keys %gene2)
  {
    #my $subSeq2 = substr($array_gene0[0],0,-1);
    my @array_gene2 = split(/\+/, $key2);
    #if(($array_gene2[0] =~ m/$subSeq2/) && ($array_gene2[1] eq $array_gene0[1]))
    if(($array_gene2[0] eq $array_gene0[0]) && ($array_gene2[1] eq $array_gene0[1]))
    {
      print OUTFILE "targetscan-Yes", "\t";
      $flag_targetscan = $TRUE;
      $predict_counter++;
      last;
    }
  }
  if($flag_targetscan == $FALSE)
  {
    print OUTFILE "targetscan-NO", "\t";
  }

  foreach my $key1 (keys %gene1)
  {
    #my $subSeq1 = substr($array_gene0[0],0,-1);
    my @array_gene1 = split(/\+/, $key1);
    #if(($array_gene1[0] =~ m/$subSeq1/) && ($array_gene1[1] eq $array_gene0[1]))
    if(($array_gene1[0] eq $array_gene0[0]) && ($array_gene1[1] eq $array_gene0[1]))
    {
      print OUTFILE "miRanda-Yes", "\t";
      $flag_miRanda = $TRUE;
      $predict_counter++;
      last;
    }
  }
  if($flag_miRanda == $FALSE)
  {
    print OUTFILE "miRanda-NO", "\t";
  }

  foreach my $keymiRNA (keys %miRNA7)
  {
    if($array_gene0[0] eq $keymiRNA) #same miRNA
    {
      $gene_miRNA{$key0} = $miRNA7{$keymiRNA};  #hash to store miRNA expression information. key:miRNA+Gene value:miRNA expression       
    }
  }

  for(my $k=0; $k<$sampleSize; $k++)
  {
    $gene_finalmiRNA{$key0} .= $gene_miRNA{$key0}[$k + 1];
    if($k < ($sampleSize - 1))
    {
      $gene_finalmiRNA{$key0} .= "\t";
    }
  }

  foreach my $keymRNA (keys %mRNA6)
  {
      if($array_gene0[1] eq $keymRNA) #same gene
      {
        for(my $l=0; $l<$sampleSize; $l++)
        {
          $gene_mRNA{$key0} .= $mRNA6{$keymRNA}[$l + 1];
          if($l < ($sampleSize - 1))
          {
            $gene_mRNA{$key0} .= "\t";
          }
        }

        $gene_mRNA_string = $gene_mRNA{$key0};
        last;
      }
  }
  
  print OUTFILE $gene_finalmiRNA{$key0}, "\t";
  print OUTFILE $gene_mRNA_string, "\n";
   
  
  my @timePoint;
  for(my $h=0; $h <= $sampleSize; $h++)
  {
    if($h == 0)
    {
      $timePoint[0][$h] = 'Samples';
      #print $timePoint[0][$h], "==========\n";
    }
    elsif($h > 0)
    {
      $timePoint[0][$h] = $column_header[$h - 1];
      #print $timePoint[0][$h], "\n";
    } 
  }

  my @data;
  my @mdata;
  my $miRNACounter;
  my $sizeOfHash;
  my $endRow = 0;

  my $samplePlot = $sampleSize + 1;
  #for prediction database check
  if ($predict_counter >= $predictednum)
  {
    my $worksheet = $workbook->add_worksheet();
    my $chart = $workbook->add_chart( type => 'line', embedded => 1 );
    $worksheet->insert_chart( 'E2', $chart, 1, 1);

    foreach my $finalindexGene (keys %gene_finalmiRNA) {
      if($finalindexGene eq $key0)
      {
        $miRNACounter = 1;
          my @spreadmiRNAArray = split ('\t', $gene_finalmiRNA{$finalindexGene});

          for(my $m=0; $m<$sampleSize; $m++)
          {
            if($m == 0)
            {
              $data[0][$m] = $gene{$key0}[1];
            }
            else
            {
              $data[0][$m] = $spreadmiRNAArray[$m - 1] + 0;
            } 
          }
          $data[0][$sampleSize] = $spreadmiRNAArray[$sampleSize - 1] + 0;

          if($miRNACounter == 1) #the first miRNA
          {
            $chart->add_series(
              categories => "=Sheet$sheetCounter!\$A2:\$A$samplePlot",
              values     => "=Sheet$sheetCounter!\$B2:\$B$samplePlot",
              #y2_axis => 1,
              name_formula       => "=Sheet$sheetCounter!\$B1",
            );
            $worksheet->write('A1', \@timePoint);
            $worksheet->write('B1', \@data );
          }
	  $miRNACounter++;
      }
    }
    my @spreadmRNAArray = split ('\t', $gene_mRNA{$key0});

    for(my $n=0; $n<$sampleSize; $n++)
    {
      if($n == 0)
      {
        $mdata[0][$n] = $array_gene0[1];
      }
      else
      {
        $mdata[0][$n] = $spreadmRNAArray[$n - 1] + 0;
      } 
      $mdata[0][$sampleSize] = $spreadmRNAArray[$sampleSize - 1] + 0;
    }

    my $currentSheetCounter = $sheetCounter ;
    if($miRNACounter == 2)
    {
      $chart->add_series(
        categories => "=Sheet$currentSheetCounter!\$A2:\$A$samplePlot",
        values     => "=Sheet$currentSheetCounter!\$C2:\$C$samplePlot",
        y2_axis => 1,
        name_formula       => "=Sheet$currentSheetCounter!\$C1",
      );
      $worksheet->write('C1', \@mdata );
    }
  $sheetCounter++;
  #$counter++;
  }
}
close(OUTFILE);

#`mv Plot_chart_y2Axis.xlsx $predictionpath`;

sub mean {
    my ($vector)=@_;
    my $num = scalar(@{$vector}) - 1;
    my $sum_x = '0';
    my $sum_y = '0';
    for (my $i = 1; $i < scalar(@{$vector}); ++$i){
        $sum_x += $vector->[$i][1];
        $sum_y += $vector->[$i][2];
    }
    my $mu_x = $sum_x / $num;
    my $mu_y = $sum_y / $num;
    return($mu_x,$mu_y);
}

sub ss {
    my ($vector,$mean_x,$mean_y,$one,$two)=@_;
    my $sum = '0';
    for (my $i=1;$i<scalar(@{$vector});++$i){
        $sum += ($vector->[$i][$one]-$mean_x)*($vector->[$i][$two]-$mean_y);
    }
    return $sum;
}

sub correlation {
    my ($vector) = @_;
    my ($mean_x,$mean_y) = mean($vector);
    my $ssxx=ss($vector,$mean_x,$mean_y,1,1);
    my $ssyy=ss($vector,$mean_x,$mean_y,2,2);
    my $ssxy=ss($vector,$mean_x,$mean_y,1,2);
    my $correl=correl($ssxx,$ssyy,$ssxy);
    return $correl;
    
}

sub correl {
    my($ssxx,$ssyy,$ssxy)=@_;
    my $sign;
    my $correl = 1000000;
    if($ssxy != 0)
    {
      $sign=$ssxy/abs($ssxy);
      $correl=$sign*sqrt($ssxy*$ssxy/($ssxx*$ssyy));
    }
    return $correl;
}

sub cleanID {
    my ($sequence)=@_;
    my $new_sequence;
    my @array_pack = split('-', $sequence);
    #if(($#array_apck + 1) > 3) #if there are more than two -
     $array_pack[2] =~ s/[a-zA-Z]//g;
     $array_pack[2] =~ s/\*//g;
     $new_sequence = $array_pack[0]."-".$array_pack[1]."-".$array_pack[2];
    return $new_sequence;
}
