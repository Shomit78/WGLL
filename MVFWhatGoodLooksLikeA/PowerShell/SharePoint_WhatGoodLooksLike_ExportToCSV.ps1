## PowerShell script for exporting What Good Looks Like data to CSV for Mole Valley Farmers
## Author: Grant McCombie (Sword Charteris); Date: 19/06/2015

function Html-ToText {  
    param([System.String] $html)  
    # remove line breaks, replace with spaces  
    $html = $html -replace "(`r|`n|`t)", " "  
    # write-verbose "removed line breaks: `n`n$html`n"  
    # remove invisible content  
    @('head', 'style', 'script', 'object', 'embed', 'applet', 'noframes', 'noscript', 'noembed') | % {  
        $html = $html -replace "<$_[^>]*?>.*?</$_>", ""  
    }  
    # write-verbose "removed invisible blocks: `n`n$html`n"  
    # Condense extra whitespace  
    $html = $html -replace "( )+", " "  
    # write-verbose "condensed whitespace: `n`n$html`n"  
    # Add line breaks  
    @('div','p','blockquote','h[1-9]') | % { $html = $html -replace "</?$_[^>]*?>.*?</$_>", ("" + '$0')}   
    # Add line breaks for self-closing tags  
    @('div','p','blockquote','h[1-9]','br') | % { $html = $html -replace "<$_[^>]*?/>", ('$0' + "`n")}   
    # write-verbose "added line breaks: `n`n$html`n"  
    #strip tags   
    $html = $html -replace "<[^>]*?>", ""  
    # write-verbose "removed tags: `n`n$html`n"  
    # replace common entities  
    @(   
        @("&amp;bull;", " * "),  
        @("&amp;lsaquo;", "<"),  
        @("&amp;rsaquo;", ">"),  
        @("&amp;(rsquo|lsquo);", "'"),  
        @("&amp;(quot|ldquo|rdquo);", '"'),  
        @("&amp;trade;", "(tm)"),
        @("&amp;frasl;", "/"),  
        @("&amp;(quot|#34|#034|#x22);", '"'),  
        @('&amp;(amp|#38|#038|#x26);', "&amp;"),  
        @("&amp;(lt|#60|#060|#x3c);", "<"),  
        @("&amp;(gt|#62|#062|#x3e);", ">"),  
        @('&amp;(copy|#169);', "(c)"),  
        @("&amp;(reg|#174);", "(r)"),  
        @("&amp;nbsp;", " "),  
        @("&amp;(.{2,6});", "")  
    ) | % { $html = $html -replace $_[0], $_[1] }  
    # write-verbose "replaced entities: `n`n$html`n"  
    return $html
}  

Add-PSSnapin "Microsoft.SharePoint.PowerShell" -ErrorAction SilentlyContinue
$web = Get-SPWeb "http://development.sharepoint.grant.local/mvf/wgll3"
$purge = $false;
$reviewsPath = "C:\Temp\WGLLReviews.csv"
$answersPath = "C:\Temp\WGLLAnswers.csv"
$reviews = $web.Lists.TryGetList('Reviews')
$answers = $web.Lists.TryGetList('Answers')
$query = New-Object -TypeName Microsoft.SharePoint.SPQuery
## create headers for the list
"ReviewID,Author,Created,Status,Store,VisitType,VisitSummary,Notes" | Out-File -FilePath $reviewsPath -Append -Encoding utf8
foreach ($review in $reviews.GetItems($query)) {
    $author = $($review['Author']).Split('#')[1]
    $visitSummary = Html-ToText $review["WGLLVisitSummary"]
    $notes = Html-ToText $review["WGLLNotes"]
    "$($review['Title']),`"$($author)`",`"$($review['Created'])`",$($review['WGLLStatus']),`"$($review['WGLLStore'])`",$($review['WGLLStatus']),`"$($visitSummary)`",`"$($notes)`"" | Out-File -FilePath $reviewsPath -Append -Encoding utf8
}
##create headers for the listanswer
$answerHeaders = "ReviewID,Criteria,CriteriaDetail,Subset,Result,ReasonForFailure,Non-Negotiable,Author,Created" | Out-File -FilePath $answersPath -Append -Encoding utf8
foreach ($answer in $answers.GetItems($query)) {
    $author = $($answer['Author']).Split('#')[1]
    $criteriaDetail = Html-ToText $answer['WGLLCriteriaDetail']
    Write-Host $criteriaDetail
    "$($answer['WGLLReviewID']),`"$($answer['Title'])`",`"$criteriaDetail`",`"$($answer['WGLLSubset'])`",$($answer['WGLLResult']),`"`",$($answer['WGLLNonNegotiable']),`"$($author)`",`"$($answer['Created'])`"" | Out-File -FilePath $answersPath -Append -Encoding utf8
}
if ($purge) {
	##Need to clear lists
}
else {
    Write-Host "Purged all list items: $($purge)"
}