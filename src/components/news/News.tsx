import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  CardMedia,
  CardActions,
  Button,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { mockNews } from '../../services/mockData';
import { NewsArticle } from '../../types';

const News: React.FC = () => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSaveArticle = (articleId: string) => {
    if (savedArticles.includes(articleId)) {
      setSavedArticles(savedArticles.filter((id) => id !== articleId));
    } else {
      setSavedArticles([...savedArticles, articleId]);
    }
  };

  // Filter news by search query only
  const filteredNews = mockNews.filter((article) => {
    // Filter by search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      (article.relatedSymbols &&
        article.relatedSymbols.some((symbol) =>
          symbol.toLowerCase().includes(query)
        ))
    );
  });

  return (
    <Box sx={{ px: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, mt: 2, textAlign: 'center', fontWeight: 'medium' }}>
        Market News
      </Typography>

      <Grid container spacing={3}>
        {/* Search Bar */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* News Articles */}
        <Grid item xs={12}>
          <NewsGrid
            news={filteredNews}
            savedArticles={savedArticles}
            onSaveArticle={handleSaveArticle}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

interface NewsGridProps {
  news: NewsArticle[];
  savedArticles: string[];
  onSaveArticle: (articleId: string) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({
  news,
  savedArticles,
  onSaveArticle,
}) => {
  const theme = useTheme();

  if (news.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No news articles found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search to find more articles.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {news.map((article) => (
        <Grid item xs={12} md={6} lg={4} key={article.id}>
          <Card
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 260,
              position: 'relative',
              overflow: 'hidden',
              pt: 1,
            }}>
            <Typography
              variant="subtitle1"
              sx={{
                lineHeight: 1.2,
                fontSize: '0.85rem',
                fontWeight: 'medium',
                px: 2.5,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
              {article.title}
            </Typography>

            <CardMedia
              component="img"
              height="70"
              image={article.imageUrl || 'https://via.placeholder.com/300x70'}
              alt={article.title}
              sx={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
              }}
            />

            {/* Source and Date */}
            <Box sx={{ px: 2.5, pb: 0.5, pt: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.secondary',
                  display: 'block',
                }}>
                {`${article.source} • ${new Date(
                  article.publishedAt
                ).toLocaleDateString()}`}
              </Typography>
            </Box>

            <CardContent
              sx={{
                py: 0.5,
                px: 2.5,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  mb: 'auto',
                  height: 32,
                }}>
                {article.summary}
              </Typography>

              <Box
                sx={{
                  mt: 'auto',
                  pt: 0.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.4,
                  minHeight: 18,
                  justifyContent: 'flex-start',
                }}>
                <Chip
                  label={
                    article.category.charAt(0).toUpperCase() +
                    article.category.slice(1)
                  }
                  size="small"
                  sx={{
                    height: 16,
                    '& .MuiChip-label': { px: 0.6, fontSize: '0.6rem' },
                  }}
                  color={
                    article.category === 'company'
                      ? 'primary'
                      : article.category === 'market'
                      ? 'success'
                      : article.category === 'economic'
                      ? 'info'
                      : article.category === 'global'
                      ? 'warning'
                      : 'secondary'
                  }
                />
                {article.relatedSymbols &&
                  article.relatedSymbols.map((symbol) => (
                    <Chip
                      key={symbol}
                      label={symbol}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 16,
                        '& .MuiChip-label': { px: 0.6, fontSize: '0.6rem' },
                      }}
                    />
                  ))}
              </Box>
            </CardContent>
            <CardActions
              disableSpacing
              sx={{
                pt: 0,
                pb: 0.5,
                px: 2.5,
                mt: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <Button
                size="small"
                color="primary"
                href={article.url}
                target="_blank"
                sx={{
                  fontSize: '0.65rem',
                  py: 0.1,
                  minWidth: '60px',
                  mx: 'auto',
                }}>
                Read More
              </Button>
              <Box sx={{ display: 'flex' }}>
                <IconButton
                  aria-label="share article"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        text: article.summary,
                        url: article.url,
                      });
                    }
                  }}
                  size="small"
                  sx={{ p: 0.3 }}>
                  <ShareIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label={
                    savedArticles.includes(article.id)
                      ? 'unsave article'
                      : 'save article'
                  }
                  onClick={() => onSaveArticle(article.id)}
                  color={
                    savedArticles.includes(article.id) ? 'primary' : 'default'
                  }
                  size="small"
                  sx={{ p: 0.3 }}>
                  {savedArticles.includes(article.id) ? (
                    <BookmarkIcon fontSize="small" />
                  ) : (
                    <BookmarkBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default News;
